var buttonColors = ["btn-tl", "btn-tr", "btn-bl", "btn-br"]  //tr-topRight, tl=topLeft, br-bottomRight, bl-bottomLeft
var gamePattern = []
var userClickedPattern = []
var started = false
var level = 0
const audios = {
    "btn-tl": new Audio("sounds/btn-tl.mp3"),
    "btn-tr": new Audio("sounds/btn-tr.mp3"),
    "btn-bl": new Audio("sounds/btn-bl.mp3"),
    "btn-br": new Audio("sounds/btn-br.mp3"),
    "wrong": new Audio("sounds/wrong.mp3"),
}
/*
    btn-tl 0.417959,
    btn-tr 0.391837
    btn-br 0.228
    btn-bl 0.438375
*/
// audios["btn-tl"].playbackRate = 2
// audios["btn-tr"].playbackRate = 2
// audios["btn-br"].playbackRate = 1
// audios["btn-bl"].playbackRate = 2


function nextSequence() {
    userClickedPattern = []
    level++
    $("#level-title").text("Level " + level)
    var randomNumber = Math.floor(Math.random() * 4)
    var randomChosenColor = buttonColors[randomNumber]
    gamePattern.push(randomChosenColor)
    console.log(gamePattern)
    playPattern(gamePattern)
}

async function playPattern(gamePattern) {
    for (i = 0; i < gamePattern.length; i++) {
        await new Promise(function (resolve) {
            setTimeout(function () {
                $("#" + gamePattern[i]).fadeIn(50).fadeOut(50).fadeIn(100)
                audios[gamePattern[i]].play()
                resolve()
            }, 200)
        });
    }
}

function handleButtonClick() {
    var userChosenColor = $(this).attr("id")
    playSound(userChosenColor)
    userClickedPattern.push(userChosenColor)
    // console.log("userClickedPattern", userClickedPattern)
    animatePress(userChosenColor)
    checkAnswer(userClickedPattern.length - 1)
}

function playSound(name) {
    audios[name].play()
    console.log(name, audios[name].duration)
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed")
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed")
    }, 200)
}

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("success")
        if (gamePattern.length === userClickedPattern.length) {
            setTimeout(function () {
                nextSequence()
            }, 1000)
        }
    }
    else {
        console.log("wrong")
        playSound("wrong")
        $("body").addClass("game-over")
        setTimeout(function () {
            $("body").removeClass("game-over")
        }, 200)
        $("#level-title").html(`
            <span>
                Game Over
                <button id="btn-restart" class="btn btn-secondary btn-lg">Restart</button></span>
        `)
        startOver()
    }
}

function startOver() {
    level = 0
    gamePattern = []
    playPattern(gamePattern)
    started = false
}

function startGame() {
    if (!started) {
        $("#level-title").text("Level " + level)
        nextSequence()
        started = true
    }
}

function enterFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        $("#full-screen").attr("hidden", true)
        $("#exit-full-screen").removeAttr("hidden")
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
        $("#exit-full-screen").attr("hidden", true)
        $("#full-screen").removeAttr("hidden")
    }
}

function init() {
    $(document).on("click", "#btn-start", startGame)
    $(".js-btn-play").on("click", handleButtonClick)
    $(document).on("click", "#btn-restart", startGame)
    console.log($("#full-screen"))
    $(document).on("click", "#full-screen", enterFullScreen)
    $(document).on("click", "#exit-full-screen", exitFullScreen)
}
init()