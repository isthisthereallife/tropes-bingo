
console.log("yeeeah")

document.getElementById("hembrgr").onclick = ((e) => {
  console.log(e)
  alert("To Be Implemented")
})
const table = document.getElementById("search_results_table")
const board_div = document.getElementById("board_div")
let searchField = document.getElementById("search_field")
let searchForm = document.getElementById("search_form")
let bingoMsg = document.createElement("span")
searchField.oninput = ((e) => {

  populateSearchResults(searchFromUserInput(searchField.value))

})


function populateSearchResults(searchResults) {
  console.log("populating with data: ", searchResults)
  table.replaceChildren()
  for (item of searchResults) {
    //console.log("item:", item)
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

    tableDataSelect.onclick = ((e) => {
      console.log("clicked: ", e.target)
      console.log(e.target.attributes.link.nodeValue)
      let tropeList = getTropesFromUrl(e.target.attributes.link.nodeValue)
      /*anropa backend här, med vald films URL (e.target.attributes.link.nodeValue)
      få tillbaka en lista på 25 objekt med 
      title, address, description
      */





      //gör table osynlig
      table.hidden = true
      //gör sökrutan osynlig
      searchForm.hidden = true
      //searchField.style.setProperty("visibility", "hidden")


      //gör ett bräde 
      const board = document.createElement("table")
      console.log("made a table")
      board.setAttribute("id", "board")
      let z = 0
      for (let x = 0; x < 5; x++) {
        //<tr>
        const tr = document.createElement("tr")
        console.log("made row ", x)
        //<th class="board_item" id="0x0">Lorem Ipsum</th>
        for (let y = 0; y < 5; y++) {
          const td = document.createElement("td")
          console.log("made a table data entry ", y)
          td.setAttribute("class", "board_item")
          td.setAttribute("id", x + "x" + y)
          td.textContent = tropeList[z].title
          td.setAttribute("address", tropeList[z].address)
          td.setAttribute("ticked", "false")
          td.setAttribute("max-width", "18vw")

          console.log(td.textContent)
          td.setAttribute("title", td.textContent + "\n\n" + tropeList[z].description)

          td.ondblclick = ((e) => {
            console.log(e)
            window.open(td.getAttribute("address", "_blank"))
          })
          td.onauxclick = ((e) => {
            console.log(e)
            window.open(td.getAttribute("address", "_blank"))
          })
          td.onclick = ((e) => {

            console.log("trope clicked: ", td.textContent, "ticked?: ", td.getAttribute("ticked"))
            console.log(td.getAttribute("id"))

            if (td.getAttribute("ticked") === "true") {
              console.log("is now UNticked")
              td.setAttribute("ticked", "false")
              td.style.setProperty("background-color", "white")
              td.style.setProperty("color", "black")

            }
            else {
              console.log("is now ticked")
              td.setAttribute("ticked", "true")
              td.style.setProperty("background-color", "rgb(159, 6, 6)")
              td.style.setProperty("color", "rgb(255, 255, 255)")
            }
            // Check for BINGO here
            if (checkForBingo() === true) {
              console.log("bingo === true")
              bingoMsg.innerText = "BINGO"
              bingoMsg.style.setProperty("position", "absolute")
              bingoMsg.style.setProperty("font-size", "6em")
              bingoMsg.style.setProperty("background-color", "rgba(0, 191, 255, 0.7)")
              bingoMsg.style.setProperty("border-radius", "15%")
              bingoMsg.style.setProperty("user-select", "none")
              bingoMsg.style.setProperty("pointer-events", "none")
              board_div.append(bingoMsg)
            }
            else {
              console.log("no more bingo")
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
  console.log("checking for bingo")
  //horizontal
  for (let row = 0; row < 5; row++) {
    for (let cell = 0; cell < 5; cell++) {
      let checkHorizontal = document.getElementById(row + "x" + cell)
      if (checkHorizontal.getAttribute("ticked") === "false") { break }
      if (cell === 4) {
        console.log("WE HAVE A BINGO HORIZONTALLY")
        return true
      }
    }
  }
  //vertical
  for (let row = 0; row < 5; row++) {
    for (let cell = 0; cell < 5; cell++) {
      let checkVertical = document.getElementById(cell + "x" + row)
      if (checkVertical.getAttribute("ticked") === "false") { break }
      if (cell === 4) {
        console.log("WE HAVE A BINGO vertically")
        return true
      }
    }
  }
  //diagonal 0x0 1x1 2x2 3x3 4x4
  if (document.getElementById("0x0").getAttribute("ticked") === "true" &&
    document.getElementById("1x1").getAttribute("ticked") === "true" &&
    document.getElementById("2x2").getAttribute("ticked") === "true" &&
    document.getElementById("3x3").getAttribute("ticked") === "true" &&
    document.getElementById("4x4").getAttribute("ticked") === "true") {
    console.log("DIAGONAL BINGO ltr")
    return true
  }
  //diagonal 0x4 1x3 2x2 3x1 4x0
  if (document.getElementById("0x4").getAttribute("ticked") === "true" &&
    document.getElementById("1x3").getAttribute("ticked") === "true" &&
    document.getElementById("2x2").getAttribute("ticked") === "true" &&
    document.getElementById("3x1").getAttribute("ticked") === "true" &&
    document.getElementById("4x0").getAttribute("ticked") === "true") {
    console.log("DIAGONAL BINGO rtl")
    return true
  }
}


// TODO set to async + await
function searchFromUserInput(input) {
  //jag kommer få in address, title, imgURL, description som JSON

  let backendURL = ""
  let results = [{}]

  if (backendURL === "") {
    let mockData = [{
      address: "/pmwiki/pmwiki.php/Film/TheHobbit", title: "The Hobbit (Film)", imgUrl: "https://static.tvtropes.org/pmwiki/pub/images/e6e70d7d_c031_4d99_8038_7a531a01e186.jpeg",
      description: `Thorin: So...this is the Hobbit....`
    }, {
      address: "/pmwiki/pmwiki.php/WesternAnimation/TheReturnOfTheKing", title: "The Return of the King (WesternAnimation)",
      imgUrl: "https://static.tvtropes.org/pmwiki/pub/images/return_of_the_king_9.png", description: `Our Orcs Are Different: Than the Goblins in The Hobbit, a case of Art Shift....`
    }]
    results = mockData
  }



  //det här anropet ska gå till backenden, som i sin tur anropar tvtropes
  if (input.length > 0 && backendURL !== "") {
    const res = fetch(backendURL + "/tropesbingo/search/" + input)
    results = res.then(r => { console.log(r) })
    res.then(response => { return response.json() })
  }
  console.log("returning: ", results)
  return results
}


//TODO set to async + await
function getTropesFromUrl(url) {
  let results
  let backendURL = ""

  if (backendURL === "") {

    results = [{ title: "Loltrope1", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/NotQuiteDead", description: "trope nummer 1 seru ut såhär" },
    { title: "tropenummer2", address: "about:blank", description: "tvåannnn" }, {
      title: "Tropum ipdididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididididisum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Tropum ipsum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Tropum ipsum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "1", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Tropum ipsum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "ä", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Tropum ipsum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "3", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Tropum ipsum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Tropum ioooooooooooooooopsum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Police Are Useless ", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/PoliceAreUseless", description: "i got bored"
    }, {
      title: "Tropum ipsum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Tropum ipsum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Tropum ipsum", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "o", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "Tm", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "aaaa", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "bbbbb", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "eeeee", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "ppppp", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "eeejjeeeeeeejjm", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/WeirdnessCensor", description: "i got bored"
    }, {
      title: "The Only One", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/TheOnlyOne", description: "i got bored"
    }, {
      title: "Bystander Syndrome", address: "https://tvtropes.org/pmwiki/pmwiki.php/Main/BystanderSyndrome", description: "i got bored"
    }]
  } else {
    results = fetch(backendURL + "/tropesbingo/film/" + url).then(res => { console.log(res) }).then(res => { return res.json })


  }
  return results
}