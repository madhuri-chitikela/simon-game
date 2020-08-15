var buttonColors = ["btn-rt", "pink", "btn-tl", "yellow"]
var gamePattern = []
var userClickedPattern = []
var started = false
var level = 0

function nextSequence() {
    userClickedPattern = []
    level++
    $("#level-title").text("Level " + level)
    var randomNumber = Math.floor(Math.random() * 4)
    //console.log("randomNumber", randomNumber)
    var randomChosenColor = buttonColors[randomNumber]
    gamePattern.push(randomChosenColor)
    console.log(gamePattern)
    playPattern(gamePattern)
}

async function playPattern(gamePattern) {
    for (i = 0; i < gamePattern.length; i++) {
        await new Promise(function (resolve) {
            setTimeout(function () {
                $("#" + gamePattern[i]).fadeIn(100).fadeOut(100).fadeIn(200)
                var audio = new Audio("sounds/" + gamePattern[i] + ".mp3")
                audio.play()
                resolve()
            }, 400)
        });
    }
}

function handleButtonClick() {
    var userChosenColor = $(this).attr("id")
    userClickedPattern.push(userChosenColor)
    console.log("userClickedPattern", userClickedPattern)
    playSound(userChosenColor)
    animatePress(userChosenColor)
    checkAnswer(userClickedPattern.length - 1)
}

function playSound(name) {
    //for (i = 0; i < gamePattern.length + 1; i++) {
    var audio = new Audio("sounds/" + name + ".mp3")
    audio.play()
    //}
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
                <button id="btn-restart">Restart</button></span>
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

function init() {
    $(document).on("click", "#btn-start", startGame)
    $(".js-btn-play").on("click", handleButtonClick)
    $(document).on("click", "#btn-restart", startGame)
}
init()