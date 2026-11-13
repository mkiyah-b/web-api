let topKnob = document.querySelector('#topButton');
let bottomKnob = document.querySelector('#bottomButton');
let topDrag = false;
let bottomDrag = false;
let lampButton = document.querySelector('#lampButton');
let lampLava = document.querySelectorAll('.lampLava');
let lampCont = document.querySelector('.middleLamp');
let lampOn = false;
let colors = [];
let topTV = document.querySelector('#topTV');
let bottomTV = document.querySelector('#bottomTV');

/// TV STUFF
// Turn the Knobs on the TVs
topKnob.addEventListener('mousedown', function() {
  topDrag = true;
});
bottomKnob.addEventListener('mousedown', function() {
  bottomDrag = true;
});
//Leave the knobs in place
document.addEventListener('mouseup', function() {
  topDrag = false;
  bottomDrag = false;
});
//When the knobs turn, change the channel
document.addEventListener("mousemove", function (e) {
  if (topDrag || bottomDrag) {
    let data = 0;
    if (e.clientX >= 427) {
      data = e.clientX - 427;
    }
    else {
      data = '-' + (424 - e.clientX);
    }
    if (topDrag) {
      topKnob.style.transform = 'rotate(' + data + 'deg';
      if (data % 15 === 0) {
        getVideo(topTV);
      }
    }
    else if (bottomDrag) {
      bottomKnob.style.transform = 'rotate(' + data + 'deg';
      if (data % 15 === 0) {
        getVideo(bottomTV);
      }
    }
  }
});
//// getVideo -- get a video and change the corresponding tv
/// uses nasa web api
async function getVideo(tvSrc) {
  const nasa = "https://images-api.nasa.gov/search?q=stars&media_type=video&page_size=1&page=" + (Math.floor(Math.random() * 100) + 1);
  try {
    const getit = await fetch(nasa);
    if (!getit.ok) {
      console.log(nasa);
      throw new Error(`Response status: ${getit.status}`);
    }
    const theVidJson = await getit.json();
    const url = theVidJson.collection.items[0].href;
    // console.log(url);
    try {
      const response = await fetch(url);
      if (!response) {
        throw new Error(`Response status: ${response.status}`);
      }
      const videoURL = await response.json();
      console.log(videoURL[0]);
      // return videoURL[0];
      tvSrc.src = videoURL[0];
    } catch (e) {
      console.error(e.message);
    }

  } catch (error) {
    console.error(error.message);
  }
}


//// getRandomPainting -- change the paintings when clicked
// uses the Met web api
async function getRandomPainting(paintingNum) {
  // get paintings from the drawing department
  const deps = "https://collectionapi.metmuseum.org/public/collection/v1.1/search?departmentId=9&hasImages=true&offset=" + (Math.floor(Math.random() * 5) * 100);
  try {
    const response = await fetch(deps);
    if (!response.ok) {
      console.log(deps)
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    //pick a rand painting
    const url = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + result.objectIDs[Math.floor(Math.random() * 100)];
    try {
      const responseNext = await fetch(url);
      if (!responseNext.ok) {
        console.log(url)
        throw new Error(`Response status: ${responseNext.status}`);
      }
      const data = await responseNext.json();
      if (data.primaryImage != "") {
        paintingNum.src = data.primaryImage;
      }
    }catch (e) {
      console.error(e.message);
    }
  } catch (error) {
    console.error(error.message);
  }
  
}


///LAMPS
// toggle lamp
lampButton.addEventListener("click", function(e) {
  lampOn = !lampOn;
  if (lampOn) {
    getLampColor();
    console.log('Im On');
  }
  else {
    lampCont.style.backgroundColor = "rgb(155, 155, 155)";
    lampLava.forEach(lava => {
      lava.style.backgroundColor = "rgb(155, 155, 155)";
    })
    console.log('Im Off');
  }
})
//// getLampColor -- change the lava
/// uses colormind web api (plus method and headers in fetch)
async function getLampColor() {
  const url = 'http://colormind.io/api/';
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "{\"model\":\"default\"}",
    });

    const data = await response.json();
    for (let i = 0; i < 3; i++) {
      colors[i] = data.result[Math.floor(Math.random() * 5)];
    }
    if (colors.length != 0) {
      lampCont.style.backgroundColor = "rgb(" + colors[0][0] + "," + colors[0][1] + "," + colors[0][2] + ")";
      lampLava[0].style.backgroundColor = "rgb(" + colors[1][0] + "," + colors[1][1] + "," + colors[1][2] + ")";
      lampLava[1].style.backgroundColor = "rgb(" + colors[2][0] + "," + colors[2][1] + "," + colors[2][2] + ")";
    }
  } catch (error) {
    console.error(error.message);
  }  
}

