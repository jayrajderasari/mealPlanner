console.log("Hello")

document.getElementById('submitButton').addEventListener('click', fetchData)

async function fetchData() {
    let cuisine = document.getElementById('cuisineInput').value 

    let res = await fetch("http://127.0.0.1:5000/?cuisine=" + cuisine)
    let res_json = await res.json()
    console.log(res_json)

    document.getElementById('content-container').innerHTML = 
    `<h3> ${res_json[0]} </h3> <br>
    <img src="${res_json[1]}" class="rounded mx-auto d-block" alt="...">`
}