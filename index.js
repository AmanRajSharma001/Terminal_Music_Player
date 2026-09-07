const fs = require("fs");

const path = require("path")
const folder = "./songs";

const filePath = path.join(__dirname,folder);

const songs = fs.readdirSync(filePath).filter((element)=>element.endsWith(".mp3"));

let selected_Song = 0;
let Player = null;
let isPaused = false;

(async ()=>{
    const audio = (await import("audio")).default;

    console.log("🎶 Welcome to the Songs App 🎶")

    process.stdin.setEncoding("utf-8");
    process.stdin.setRawMode(true);
    process.stdin.resume();

    showSongs();

    process.stdin.on("data", async (input) => {
        if (input == 'q'){
            quit();
            return;
        }
        if (input === '\r'){
            await playSong(selected_Song);
            return;
        }
        if (input === 'p'){
            pause();
            return;
        }
        if (input === 'r'){
            resume();
            return;
        }

        if (input === '\x1b[A'){
            if (selected_Song > 0){
                selected_Song--;
                process.stdout.write(`\x1b[${songs.length}A]`);
                showSongs();
            }
        }else if (input === '\x1b[B'){
            if (selected_Song < songs.length-1){
                selected_Song++;
                process.stdout.write(`\x1b[${songs.length}A]`)
                showSongs();
            }
        }
    })
    function showSongs(){
        for (let i = 0; i<songs.length; i++){
            process.stdout.write("\x1b[2K");
            
            if (i === selected_Song){
                console.log(`=> ${i + 1}: ${songs[i]}`);
            }else{
                console.log(`   ${i + 1}: ${songs[i]}`);
            }
        }
    }
    
    async function playSong(index){
        if (Player){
            Player.stop();
            Player.dispose();
            Player = null;
        }
        Player = await audio(`./songs/${songs[index]}`);
        isPaused = false;
        Player.play()
    }
})();



