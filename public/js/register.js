const allInput = document.querySelectorAll('input:not(input[type="submit"])')
const varifyEmail = document.getElementById('email-varify')
for (let i of allInput) {
    i.addEventListener('mouseover', (e) => {
        e.target.focus()
    })
    i.addEventListener('blur', (e) => {
        isValid(e.target)
    })
}
const selectOptions = document.querySelectorAll(".select-options")
for (let s of selectOptions) {
    Array.from(s.children[1].children).forEach(li => {
        li.onclick = (e) => {
            s.children[1].querySelectorAll('.selected').forEach(selected => {
                selected.classList.remove('selected')
            })
            valid(s.children[0])
            s.children[0].children[0].innerHTML = e.target.innerHTML
            s.children[0].children[0].value = e.target.value
            e.target.classList.add('selected')
            s.open = false
        }
    })
}
const slides = document.querySelectorAll('.slide')
const totalSlides = slides.length
slides[0].querySelector("input").focus()
const info = {}
let currentSlideNo = 0
const nextBtn = document.getElementById('next')
const form = document.getElementById('form')
const previous = document.getElementById('previous')

form.onsubmit = async (event) => {
    event.preventDefault()
    if (currentSlideNo >= totalSlides-1) {
        res = await varifyAndSubmit()
        alert(res)
        return
    } else {
        const isc = await isChecked(slides[currentSlideNo])
    if (isc) {
        varifyEmail.value = info.email
        slides[currentSlideNo].style.display = 'none'
        slides[++currentSlideNo].style.display = 'flex'
        slides[currentSlideNo].querySelector('input').focus()
        if (slides[currentSlideNo].id == "varifyEmailOtp") {
            newOtp()
        }
    }
    }
    console.log(info) // for development debuging
}


// do it >>>>

const varifyAndSubmit = () => {
return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Done") /// to to do do
    }, 2000)
})
}


previous.onclick = () => {
    if (currentSlideNo <= 0) {
        // previous.style.display = 'hidden'
        return
    }
    previous.style.display = 'block'
    slides[currentSlideNo].style.display = 'none'
    slides[--currentSlideNo].style.display = 'flex'
    slides[currentSlideNo].querySelector('input').focus()
}

const isChecked = async (element) => {
    const fields = element.querySelectorAll('input')
    const options = element.querySelectorAll('.select-options')
    const isOptions = (options) => {
        let ret = true
        options.forEach(op => {
        if (op.children[0].children[0].value == 0) {
            ret *= false
            invalid(op.children[0])
           } else {
            info[op.id] = op.children[0].children[0].value
           }
        })
        return ret
    }
    const isFields = (fields) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Map each field to a validation promise
                const results = await Promise.all(Array.from(fields).map(async (fi) => {
                    return await isValid(fi)
                }))
                // Check if all validations passed
                const ret = results.every(result => result === true)
                resolve(ret)
            } catch (error) {
                reject(error)
            }
        })
    }

    return await isFields(fields) * isOptions(options)
}
const invalid = (field) => {
    field.style.borderBottom = "1px solid #d44"
}
const valid = (field) => {
    field.style.borderBottom = "1px solid #4d4"
}
async function isValid(fi) {
    let is
     if (fi.value != '') {
                switch (fi.type) {
                    case 'text' || 'password':
                        is = true
                        break
                    case 'email':
                        is = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(fi.value)
                        break
                    case 'number':
                        if (fi.id == "phone" && fi.value.length < 10) {
                            is = false
                        } else {
                        is = true
                        }
                        break;
                    default:
                        is = true
                }
                if (is && fi.classList.contains("unique")) {
                    is = !await isExits([fi.id, fi.value])
                    !is ? showErrMsg(fi, "already exists!") : removeErrMsg(fi)
                }
                !is ? invalid(fi) : valid(fi)
                info[fi.id] = fi.value
           } else {
            is = false
            invalid(fi)
           }
           return is
}
const showErrMsg = (el, msg) => {
    const label = document.querySelector(`label[for="${el.id}"]`)
    if (label.children[0]) {
        label.children[0].remove()
    }
        label.innerHTML += `<span class="input-err-msg">${msg}</span>`
}
const removeErrMsg = (el) => {
    const label = document.querySelector(`label[for="${el.id}"]`)
    if (label.children[0]) {
        label.children[0].remove()
    }
}
function loadingDotAnime(el) {
    let i = 0
    let interval = setInterval(() => {
        if (i >= 4) {
            i = 0
            el.innerHTML = ''
        } else {
            el.innerHTML += '.'
            i++
        }
    }, 200)
    return interval
}
const resend = document.getElementById('resend')
const counter = document.getElementById('counter')
counter.style.display = 'none'
const otpInfo = document.getElementById('otp-info')
async function newOtp() {
    if (counterInterval) return
    otpInfo.children[0].innerHTML = `<span>Requesting an OTP<span id="loading-dot-anime"></span></span>`
    var dotInterval = loadingDotAnime(document.getElementById('loading-dot-anime'))
    return new Promise((resolve, reject) => {
        otpInfo.children[2].style.display = 'none'
        setTimeout(() => {
            startCouter()
            clearInterval(dotInterval)
            resolve(true)
        }, 3000)
    })
}
var counterInterval
function startCouter() {
    let count = 30
    otpInfo.children[0].innerHTML = "<span>Otp sent!</span>"
    counter.innerHTML = "resend after " + count
    counter.style.display = 'block'
    otpInfo.children[2].style.display = 'none'
    counterInterval = setInterval(() => {
        counter.innerHTML = "resend after " + --count
        }, 1000)
    setTimeout(() => {
        clearInterval(counterInterval)
        counterInterval = null
        otpInfo.children[2].style.display = 'block'
        counter.style.display = 'none'
    }, 30000)
}
resend.onclick = (e) => {
    newOtp()
}
const previousRequests = {}
async function isExits([type, id]) {
    const controller = new AbortController()
    const signal = controller.signal
    if (previousRequests[type]) {
        try {
        previousRequests[type].abort("request overlaping abort")
        } catch (e) {
            console.log(e)
        }
    }
    previousRequests[type] = controller
    const res = await fetch(`/students/check?${type}=${id}`, {signal})
    const response = await res.text()
    if (response == "exists") {
        return true
    } else if (response == "not exists") {
        return false
    } else {
        console.log(response)
        return false
    }
}