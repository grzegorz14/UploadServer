const selectedImages = []

window.onload = async function() {
    const box = document.getElementById("imagesBox")
    box.innerHTML = ""
    let response = await fetch("/getImages", { method: "POST" })
    response.json().then(data => {
        data.images.forEach((image, i) => {
            const div = document.createElement("div")
            div.classList.add("item")
            
            const name = document.createElement("h3")
            name.id = `imageName${i}` 
            name.innerText = image

            const img = document.createElement("img")
            img.setAttribute("src", `./upload/${image}`)

            const buttonsDiv = document.createElement("div")
            div.classList.add("buttonsDiv")

            const deleteButton = document.createElement("button")
            deleteButton.innerHTML = "Delete"
            deleteButton.onclick = async () => await deleteImage(image)

            const renameButton = document.createElement("button")
            renameButton.innerHTML = "Rename"
            renameButton.onclick = async () => await renameImage(image)

            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.value = image
            checkbox.addEventListener("change", event => {
                if (event.currentTarget.checked) {
                    selectedImages.push(image)
                } else {
                    const index = selectedImages.indexOf(image)
                    if (index > -1) {
                        selectedImages.splice(index, 1)
                    }
                }
            })

            div.append(name)
            div.append(img)

            buttonsDiv.append(deleteButton)
            buttonsDiv.append(renameButton)

            div.append(buttonsDiv)
            div.append(checkbox)

            box.append(div)
        })
    })
}

async function renameImage(image) {
    const newName = prompt("New image name:") + ".jpg"
    if (newName.trim().length == 0) return
    const body = JSON.stringify({ image, newName })
    const headers = { "Content-Type": "application/json" }
    await fetch("/renameImage", { method: "POST", body, headers })
    window.location.reload()
}

async function deleteImage(image) {
    const body = JSON.stringify({ image })
    const headers = { "Content-Type": "application/json" }
    await fetch("/deleteImage", { method: "POST", body, headers })
    window.location.reload()
}

document.getElementById("deleteSelected").onclick = async () => {
    selectedImages.forEach(async (image) => {
        const body = JSON.stringify({ image })
        const headers = { "Content-Type": "application/json" }
        await fetch("/deleteImage", { method: "POST", body, headers })
    })
    window.location.reload()
}