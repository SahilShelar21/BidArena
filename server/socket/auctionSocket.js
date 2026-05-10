const pool = require("../config/db");

let rooms = {};

module.exports = (io) => {

io.on("connection", (socket) => {

console.log("Socket Connected");

socket.on("joinRoom", async ({ tournamentId }) => {

socket.join("room_" + tournamentId);

if (!rooms[tournamentId]) {
rooms[tournamentId] = {
timer: null,
seconds: 10
};
}

const room = await pool.query(
`SELECT * FROM auction_rooms WHERE tournament_id=$1`,
[tournamentId]
);

io.to("room_" + tournamentId).emit("roomState", room.rows[0]);
});


// START PLAYER AUCTION
socket.on("startAuction", async (data) => {

const {
tournamentId,
playerId,
basePrice
} = data;

await pool.query(`
UPDATE auction_rooms
SET status='live',
current_player_id=$1,
current_bid=$2,
current_team_id=NULL,
timer=10,
updated_at=NOW()
WHERE tournament_id=$3
`, [playerId, basePrice, tournamentId]);

startTimer(io, tournamentId);

const room = await getRoom(tournamentId);

io.to("room_" + tournamentId).emit("auctionStarted", room);
});


// PLACE BID
socket.on("placeBid", async (data) => {

const {
tournamentId,
teamId
} = data;

const room = await getRoom(tournamentId);

if (!room) return;

const team = await pool.query(
`SELECT purse FROM teams WHERE id=$1`,
[teamId]
);

if (team.rows[0].purse < room.current_bid)
return;

const newBid = Number(room.current_bid) + 50000;

await pool.query(`
UPDATE auction_rooms
SET current_bid=$1,
current_team_id=$2,
timer=10,
updated_at=NOW()
WHERE tournament_id=$3
`, [newBid, teamId, tournamentId]);

await pool.query(`
INSERT INTO bids
(tournament_id,player_id,team_id,amount)
VALUES($1,$2,$3,$4)
`, [
tournamentId,
room.current_player_id,
teamId,
newBid
]);

rooms[tournamentId].seconds = 10;

const updated = await getRoom(tournamentId);

io.to("room_" + tournamentId).emit("bidUpdate", updated);

});


// MANUAL SOLD
socket.on("markSold", async ({ tournamentId }) => {
await sellPlayer(io, tournamentId);
});


// UNSOLD
socket.on("markUnsold", async ({ tournamentId }) => {

await pool.query(`
UPDATE auction_rooms
SET status='idle',
current_player_id=NULL,
current_bid=0,
current_team_id=NULL,
timer=10
WHERE tournament_id=$1
`, [tournamentId]);

io.to("room_" + tournamentId).emit("playerUnsold");
});

});
};



async function getRoom(tournamentId) {
const result = await pool.query(
`SELECT * FROM auction_rooms WHERE tournament_id=$1`,
[tournamentId]
);
return result.rows[0];
}



function startTimer(io, tournamentId) {

if (rooms[tournamentId].timer)
clearInterval(rooms[tournamentId].timer);

rooms[tournamentId].seconds = 10;

rooms[tournamentId].timer = setInterval(async () => {

rooms[tournamentId].seconds--;

await pool.query(`
UPDATE auction_rooms
SET timer=$1
WHERE tournament_id=$2
`, [rooms[tournamentId].seconds, tournamentId]);

io.to("room_" + tournamentId).emit("timer", rooms[tournamentId].seconds);

if (rooms[tournamentId].seconds <= 0) {
clearInterval(rooms[tournamentId].timer);
await sellPlayer(io, tournamentId);
}

}, 1000);
}



async function sellPlayer(io, tournamentId) {

const room = await getRoom(tournamentId);

if (!room.current_team_id) {

await pool.query(`
UPDATE auction_rooms
SET status='idle',
current_player_id=NULL,
current_bid=0
WHERE tournament_id=$1
`, [tournamentId]);

io.to("room_" + tournamentId).emit("playerUnsold");
return;
}

await pool.query("BEGIN");

try {

await pool.query(`
INSERT INTO sold_players
(tournament_id,player_id,team_id,price)
VALUES($1,$2,$3,$4)
`, [
tournamentId,
room.current_player_id,
room.current_team_id,
room.current_bid
]);

await pool.query(`
UPDATE teams
SET purse = purse - $1
WHERE id=$2
`, [
room.current_bid,
room.current_team_id
]);

await pool.query(`
UPDATE players
SET sold=TRUE
WHERE id=$1
`, [
room.current_player_id
]);

await pool.query(`
UPDATE auction_rooms
SET status='idle',
current_player_id=NULL,
current_bid=0,
current_team_id=NULL,
timer=10
WHERE tournament_id=$1
`, [tournamentId]);

await pool.query("COMMIT");

io.to("room_" + tournamentId).emit("playerSold", {
playerId: room.current_player_id,
teamId: room.current_team_id,
price: room.current_bid
});

} catch (err) {

await pool.query("ROLLBACK");

console.log(err);

}

}