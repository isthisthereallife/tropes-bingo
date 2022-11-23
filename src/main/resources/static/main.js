

const table = document.getElementById("search_results_table")
const board_div = document.getElementById("board_div")
const board = document.createElement("table")
let searchField = document.getElementById("search_field")
let searchForm = document.getElementById("search_form")
let hembrgr = document.getElementById("hembrgr")
let hamburgerDiv = document.getElementById("hamburger_div")
let hamburgerSearchDiv = document.getElementById("hamburger_search_div")
let gridSizeView = document.getElementById("grid_size")
let gridSizeLower = document.getElementById("grid_size_lower")
let gridSizeHigher = document.getElementById("grid_size_higher")
let reroll = document.getElementById("reroll")
let rerollDiv = document.getElementById("reroll_div")
let searchImg = document.getElementById("search_img")
let currentMovieDiv = document.getElementById("current_movie")




let touchTimer
let touchDuration = 500
let onLongTouch

let descrMsg = document.createElement("span")
let bingoMsg = document.createElement("span")
descrMsg.setAttribute("id", "descr_msg")
bingoMsg.setAttribute("id", "bingo_msg")

//kolla i localStorage här

let gridSize = localStorage.getItem("gridSize")
if (gridSize === null) gridSize = 4
gridSizeView.innerHTML = gridSize

/*kolla localStorage, om det finnst tropes där så kan vi ju skicka in dom i denna */

let tropeList = JSON.parse(localStorage.getItem("tropeList"))
if (tropeList !== null) {
  let currentMovie = localStorage.getItem("currentWorkTitle")
  if (currentMovie !== null) {
    currentMovieDiv.textContent = currentMovie
  }

  getAndDisplayTropes()
}
searchForm.addEventListener("submit", ((e) => {
  e.preventDefault()
}))

searchField.oninput = ((e) => {
  if (searchField.value.length > 0) {
    searches(searchField.value, 1)
  } else { table.replaceChildren() }
})
async function searches(input, pageNr) {
  let searchResults = await searchFromUserInput(input, pageNr)
  populateSearchResults(searchResults)
}
let wow = document.getElementById("wow_such_animate")

hembrgr.addEventListener("animationstart", listener, false)
hembrgr.addEventListener("animationend", listener, false)
function listener(event) {

  switch (event.type) {
    case "animationstart":

      break

    case "animationend":
      if (event.target.id === "hembrgr") {
        hembrgr.removeAttribute("class")
      } else if (event.target.id === "reroll") {
        reroll.removeAttribute("class")
      }
      break

    default:
      break
  }
}

hembrgr.onclick = ((e) => {
  hembrgr.setAttribute("class", "shrink_grow")
  gridSizeLower.setAttribute("class", "grid_size_btn")
  gridSizeHigher.setAttribute("class", "grid_size_btn")

  if (hamburgerDiv.getAttribute("class") === "hamburger_div_open") {
    hembrgr.setAttribute("src", "Images/hembrgr.png")
    hamburgerDiv.setAttribute("class", "hamburger_div_close")
  }
  else {
    hembrgr.setAttribute("src", "Images/hembrgrx.png")
    hamburgerDiv.setAttribute("class", "hamburger_div_open")
  }

  reroll.removeAttribute("class")
})

if (searchField.value.length > 0) {
  searches(searchField.value, 1)
}

reroll.addEventListener("animationstart", listener, false)
reroll.addEventListener("animationend", listener, false)

reroll.onclick = ((e) => {
  reroll.setAttribute("class", "spin")
  /* hide hamburger on reroll?
  hamburgerDiv.setAttribute("class", "hamburger_div_close")
  hembrgr.setAttribute("src", "Images/hembrgr.png")
  */
  gridSizeHigher.setAttribute("class", "grid_size_btn")
  tropeList = null
  localStorage.removeItem("tropeList")
  localStorage.setItem("gridSize", gridSize)
  getAndDisplayTropes()
})

hamburgerSearchDiv.onclick = ((e) => {

  //open search
  if (searchForm.style.getPropertyValue("display") == "none") {
    board_div.style.setProperty("display", "none")
    searchForm.style.setProperty("display", "block")
    table.style.setProperty("display", "block")
    searchImg.setAttribute("src", "Images/search_x.png")
  }
  //close search
  else {
    board_div.style.setProperty("display", "flex")
    searchForm.style.setProperty("display", "none")
    table.style.setProperty("display", "none")
    searchImg.setAttribute("src", "Images/search.png")
  }


})

function populateSearchResults(searchResults) {
  table.replaceChildren()
  if (searchResults === null || !searchResults.length) {
    let nothinDiv = document.createElement("div")
    nothinDiv.setAttribute("class", "search_a")
    nothinDiv.setAttribute("id", "nothin_div")
    nothinDiv.innerHTML = "Sorry, but your search came up with nothing."
    table.append(nothinDiv)
  } else {
    for (item of searchResults) {
      let tableData = document.createElement("span")
      tableData.setAttribute("class", "search_a")
      let tr = document.createElement("tr")
      tr.setAttribute("class", "search_result_row")
      let tableDataImg = document.createElement("td")
      tableDataImg.setAttribute("class", "table_data_img")
      let tableDataInfo = document.createElement("td")
      tableDataInfo.setAttribute("class", "table_data_info")
      let tableDataSelect = document.createElement("td")
      tableDataSelect.setAttribute("class", "table_data_select_btn")
      tableDataSelect.setAttribute("link", item.address)
      let img = document.createElement("img")
      img.setAttribute("class", "result_img")
      img.src = item.imgUrl
      img.height = "60"
      tableDataImg.appendChild(img)
      let a = document.createElement("a")
      a.setAttribute("href", `https://tvtropes.org` + item.address)

      let title = document.createElement("strong")
      title.innerHTML = item.title
      title.style.setProperty("font-size", "5vw")
      title.setAttribute("class", "result_title")
      tableData.setAttribute("href", `https://tvtropes.org` + item.address)
      a.appendChild(title)

      let description = document.createElement("div")
      description.innerHTML = item.description.slice(0, item.description.length - 5)
      description.setAttribute("class", "result_description")
      description.style.setProperty("font-size", "4vw")

      tableDataInfo.appendChild(a)
      tableDataInfo.appendChild(description)

      let selectBtn = document.createElement("button")
      selectBtn.textContent = "Pick"
      selectBtn.setAttribute("link", item.address)
      selectBtn.setAttribute("title", item.title)

      tableDataSelect.appendChild(selectBtn)


      tableDataSelect.onclick = (async (e) => {
        currentMovieDiv.textContent = e.target.attributes.title.nodeValue
        hamburgerDiv.setAttribute("class", "hamburger_div_close")
        hembrgr.setAttribute("src", "Images/hembrgr.png")
        localStorage.setItem("currentWorkTitle", e.target.attributes.title.nodeValue)
        localStorage.setItem("currentWorkUrl", e.target.attributes.link.nodeValue)
        localStorage.setItem("gridSize", gridSize)
        getAndDisplayTropes(true)
      })

      tableData.append(tableDataImg)
      tableData.append(tableDataInfo)
      tr.append(tableData)
      tr.append(tableDataSelect)

      table.append(tr)

      table.append(document.createElement("hr"))



    }
  }

}


async function getAndDisplayTropes(newSearch) {
  if (tropeList === null || newSearch) {
    tropeList = await getTropesFromUrl(localStorage.getItem("currentWorkUrl"), gridSize)
  }
  if (tropeList) {
    localStorage.setItem("tropeList", JSON.stringify(tropeList))

    //gör table osynlig
    table.style.setProperty("display", "none")
    //gör sökrutan osynlig
    searchForm.style.setProperty("display", "none")
    //byt ikon på sök
    searchImg.setAttribute("src", "Images/search.png")
    //byt currentMovie

    //gör reroll i hamburgaren synlig
    rerollDiv.style.setProperty("display", "flex")
    //searchField.style.setProperty("visibility", "hidden")

    hamburgerSearchDiv.style.setProperty("display", "flex")


    board_div.style.setProperty("display", "flex")
    //rensa board_div
    board_div.replaceChildren()
    //gör ett bräde
    board.replaceChildren()
    board.setAttribute("id", "board")
    let title
    let z = 0
    for (let x = 0; x < gridSize; x++) {
      //<tr>
      const tr = document.createElement("tr")
      //<th class="board_item" id="0x0">Lorem Ipsum</th>
      for (let y = 0; y < gridSize; y++) {
        const td = document.createElement("td")
        const text = document.createElement("span")
        td.setAttribute("class", "board_item")
        td.setAttribute("id", x + "x" + y)
        text.innerHTML = tropeList[z].title

        text.setAttribute("class", "board_item_text")
        text.setAttribute("title", tropeList[z].description)

        td.setAttribute("address", tropeList[z].address)
        td.setAttribute("ticked", tropeList[z].ticked)
        if (tropeList[z].ticked === true) {
          td.style.setProperty("background-color", "rgb(159, 6, 6)")
          td.style.setProperty("color", "rgb(255, 255, 255)")

        }


        let orientation = "vw"
        let smallestSize
        smallestSize = Math.min(window.innerHeight, window.innerWidth)
        orientation = window.innerHeight > window.innerWidth ? "vw" : "vh"

        let evenSmaller = smallestSize * 1
        td.style.setProperty("width", (evenSmaller / gridSize) - 5 + orientation)
        td.style.setProperty("height", (evenSmaller / gridSize) - 5 + orientation)
        let box = (90 / gridSize) + orientation

        td.style.setProperty("width", box)
        td.style.setProperty("min-width", box)
        td.style.setProperty("max-width", box)

        td.style.setProperty("height", box)
        td.style.setProperty("min-height", box)
        td.style.setProperty("max-height", box)


        td.setAttribute("title", tropeList[z].description)


        /* td.ondblclick = ((e) => {
           window.open(td.getAttribute("address", "_blank"))
         })
         */
        td.onauxclick = ((e) => {
          window.open(td.getAttribute("address", "_blank"))
        })


        function onLongTouch(e) {

          descrMsg.innerText = td.getAttribute("title")
          let spanForA = document.createElement("span")

          let a = document.createElement("a")
          a.href = td.getAttribute("address")
          a.target = "_blank"
          a.innerText = "\nLink to trope page."
          spanForA.appendChild(a)
          descrMsg.append(spanForA)
          board_div.append(descrMsg)
          descrMsg.onclick = ((e) => {
            descrMsg.innerText = ""
            board_div.removeChild(descrMsg)
          })
        }
        td.ontouchmove = ((e) => {
          if (touchTimer) {
            clearTimeout(touchTimer)
            touchTimer = null
          }
        })

        td.ontouchstart = ((e) => {
          e.preventDefault()
          if (!touchTimer) {
            touchTimer = setTimeout(onLongTouch, touchDuration)
          }
        })


        td.ontouchend = ((e) => {
          if (touchTimer) {
            clearTimeout(touchTimer)
            touchTimer = null
          }

          if (descrMsg.innerText === "") {
            td.click()
          }
        })
        td.onclick = ((e) => {
          if (td.textContent !== "FREE SPACE") {
            if (td.getAttribute("ticked") === "true") {
              td.setAttribute("ticked", "false")
              td.style.setProperty("background-color", "white")
              td.style.setProperty("color", "black")

              tropeList.find(e => e.address === td.getAttribute("address")).ticked = false

            }
            else {
              td.setAttribute("ticked", "true")
              td.style.setProperty("background-color", "rgb(159, 6, 6)")
              td.style.setProperty("color", "rgb(255, 255, 255)")
              tropeList.find(e => e.address === td.getAttribute("address")).ticked = true

            }
            localStorage.setItem("tropeList", JSON.stringify(tropeList))


            checkForBingo()
          }
        })

        z++
        td.append(text)
        tr.append(td)
      }
      board.append(tr)
    }
    board_div.append(board)
    reroll.removeAttribute("class")

  }
  checkForBingo()
}


gridSizeHigher.onclick = ((e) => {
  gridSizeHigher.setAttribute("class", "grid_size_btn")
  if (gridSize < 5) {
    gridSize++
    gridSizeView.innerHTML = gridSize
  } else {
    gridSizeHigher.setAttribute("class", "grid_size_btn_red")
  }
})
gridSizeLower.onclick = ((e) => {
  if (gridSize > 1) {
    gridSize--
    gridSizeView.innerHTML = gridSize
  }
})

function checkForBingo() {
  let boardSize = board.rows.length
  let bingo = false
  //horizontal
  for (let row = 0; row < boardSize; row++) {
    for (let cell = 0; cell < boardSize; cell++) {
      let checkHorizontal = document.getElementById(row + "x" + cell)
      if (checkHorizontal.getAttribute("ticked") === "false") { break }
      if (cell === boardSize - 1) {
        bingo = true
      }
    }
  }
  //vertical
  for (let row = 0; row < boardSize; row++) {
    for (let cell = 0; cell < boardSize; cell++) {
      let checkVertical = document.getElementById(cell + "x" + row)
      if (checkVertical.getAttribute("ticked") === "false") { break }
      if (cell === boardSize - 1) {
        bingo = true
      }
    }
  }
  //diagonal 1
  for (let i = 0; i < boardSize; i++) {
    if (document.getElementById(i + "x" + i).getAttribute("ticked") === "false") { break }
    if (i === boardSize - 1) bingo = true
  }
  //diagonal 2
  for (let i = 0; i < boardSize; i++) {
    if (document.getElementById(i + "x" + ((boardSize - 1) - i)).getAttribute("ticked") === "false") { break }
    if (i === boardSize - 1) bingo = true
  }

  if (bingo) {
    bingoMsg.innerText = "BINGO"
    board_div.append(bingoMsg)
  }
  else {
    bingoMsg.innerText = ""
  }
}


async function searchFromUserInput(input, pageNumber = "1") {

  let results = [{}]
  input = input.replace(/[\W_]+/g, ' ')
  const res = await fetch(document.location.href + "tropesbingo/search/" + input + "/" + pageNumber)
  if (res.headers.get("content-length") === "0") {
    return null
  } else {
    results = res.json()
    return results
  }
}


async function getTropesFromUrl(url, gridSize = 4) {
  const results = await fetch(document.location.href + "tropesbingo/" + gridSize, {
    method: 'POST',
    body: url
  })

  return await results.json()
}