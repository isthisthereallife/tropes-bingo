let backendURL = "http://localhost:8080/tropesbingo/"
let gridSize = 5
console.log("yeeeah")

const table = document.getElementById("search_results_table")
const board_div = document.getElementById("board_div")
let searchField = document.getElementById("search_field")
let searchForm = document.getElementById("search_form")
let hembrgr = document.getElementById("hembrgr")
let hamburgerDiv = document.getElementById("hamburger_div")
let bingoMsg = document.createElement("span")
let gridSizeView = document.getElementById("grid_size")
let gridSizeLower = document.getElementById("grid_size_lower")
let gridSizeHigher = document.getElementById("grid_size_higher")
bingoMsg.setAttribute("id", "bingo_msg")

gridSizeHigher.onclick = ((e) => {
  gridSize++
  gridSizeView.innerHTML = gridSize
})
gridSizeLower.onclick = ((e) => {
  if (gridSize > 1) {
    gridSize--
    gridSizeView.innerHTML = gridSize
  }
})
searchForm.addEventListener("submit", ((e) => {
  e.preventDefault()
}))

searchField.oninput = (async (e) => {
  if (searchField.value.length > 0) {
    let searchResults = await searchFromUserInput(searchField.value, 1)
    populateSearchResults(searchResults)
  } else { table.replaceChildren() }
})

hembrgr.onclick = ((e) => {
  if (hembrgr.getAttribute("extended") === "true") {
    hembrgr.setAttribute("src", "Images/hembrgr.png")
    hembrgr.setAttribute("extended", "false")
    hamburgerDiv.style.setProperty("display", "none")
  }
  else {
    hembrgr.setAttribute("extended", "true")
    hembrgr.setAttribute("src", "Images/hembrgrx.png")
    hamburgerDiv.style.setProperty("display", "block")
  }
})

function populateSearchResults(searchResults) {
  table.replaceChildren()
  for (item of searchResults) {
    let a = document.createElement("a")
    a.setAttribute("class", "search_a")
    a.setAttribute("href", `https://tvtropes.org` + item.address)
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

    let title = document.createElement("strong")
    title.innerHTML = item.title
    title.style.setProperty("font-size", "5vw")
    title.setAttribute("class", "result_title")

    let description = document.createElement("div")
    description.innerHTML = item.description
    description.setAttribute("class", "result_description")
    description.style.setProperty("font-size", "4vw")

    tableDataInfo.appendChild(title)
    tableDataInfo.appendChild(description)

    let selectBtn = document.createElement("button")
    selectBtn.textContent = "Pick"
    selectBtn.setAttribute("link", item.address)

    tableDataSelect.appendChild(selectBtn)

    tableDataSelect.onclick = (async (e) => {
      console.log("suffix-url of chosen item: ", e.target.attributes.link.nodeValue)
      let tropeList = await getTropesFromUrl(e.target.attributes.link.nodeValue, gridSize)
      /*anropa backend här, med vald films URL (e.target.attributes.link.nodeValue)
      få tillbaka en lista på 25 objekt med
      title, address, description
      */
      console.log("tropelist: ", tropeList)





      //gör table osynlig
      table.hidden = true
      //gör sökrutan osynlig
      searchForm.hidden = true
      //searchField.style.setProperty("visibility", "hidden")


      //gör ett bräde
      const board = document.createElement("table")
      board.setAttribute("id", "board")
      let z = 0
      for (let x = 0; x < gridSize; x++) {
        //<tr>
        const tr = document.createElement("tr")
        //<th class="board_item" id="0x0">Lorem Ipsum</th>
        for (let y = 0; y < gridSize; y++) {
          const td = document.createElement("td")
          td.setAttribute("class", "board_item")
          td.setAttribute("id", x + "x" + y)
          td.textContent = tropeList[z].title
          td.setAttribute("address", tropeList[z].address)
          td.setAttribute("ticked", "false")
          td.setAttribute("max-width", "18vw")

          td.setAttribute("title", tropeList[z].description)

          td.ondblclick = ((e) => {
            window.open(td.getAttribute("address", "_blank"))
          })
          td.onauxclick = ((e) => {
            window.open(td.getAttribute("address", "_blank"))
          })
          td.onclick = ((e) => {

            if (td.getAttribute("ticked") === "true") {
              td.setAttribute("ticked", "false")
              td.style.setProperty("background-color", "white")
              td.style.setProperty("color", "black")

            }
            else {
              td.setAttribute("ticked", "true")
              td.style.setProperty("background-color", "rgb(159, 6, 6)")
              td.style.setProperty("color", "rgb(255, 255, 255)")
            }
            // Check for BINGO here
            if (checkForBingo() === true) {
              bingoMsg.innerText = "BINGO"
              board_div.append(bingoMsg)
            }
            else {
              bingoMsg.innerText = ""
            }

          })

          z++
          tr.append(td)
        }
        board.append(tr)
      }
      board_div.append(board)

    })



    a.append(tableDataImg)
    a.append(tableDataInfo)
    tr.append(a)
    tr.append(tableDataSelect)

    table.append(tr)

    table.append(document.createElement("hr"))



  }

}

function checkForBingo() {
  let bingo = false
  //horizontal
  for (let row = 0; row < gridSize; row++) {
    for (let cell = 0; cell < gridSize; cell++) {
      let checkHorizontal = document.getElementById(row + "x" + cell)
      if (checkHorizontal.getAttribute("ticked") === "false") { break }
      if (cell === gridSize - 1) {
        return true
      }
    }
  }
  //vertical
  for (let row = 0; row < gridSize; row++) {
    for (let cell = 0; cell < gridSize; cell++) {
      let checkVertical = document.getElementById(cell + "x" + row)
      if (checkVertical.getAttribute("ticked") === "false") { break }
      if (cell === gridSize - 1) {
        return true
      }
    }
  }
  //diagonal 1
  for (let i = 0; i < gridSize; i++) {
    if (document.getElementById(i + "x" + i).getAttribute("ticked") === "false") { break }
    if (i === gridSize - 1) return true
  }
  //diagonal 2
  for (let i = 0; i < gridSize; i++) {
    if (document.getElementById(i + "x" + ((gridSize - 1) - i)).getAttribute("ticked") === "false") { break }
    if (i === gridSize - 1) return true
  }
}


async function searchFromUserInput(input, pageNumber) {
  let results = [{}]
  const res = await fetch(backendURL + "search/" + input + "/" + pageNumber)
  results = res.json()
  return results
}



async function getTropesFromUrl(url, gridSize = 5) {
  const results = await fetch(backendURL + gridSize, {
    method: 'POST',
    body: url
  })

  return await results.json()
}