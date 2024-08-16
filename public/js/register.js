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
slides[0].querySelector("input").focus()
const info = {}
let currentSlideNo = 0
const nextBtn = document.getElementById('next')
const form = document.getElementById('form')
const previous = document.getElementById('previous')
form.onsubmit = (event) => {
    event.preventDefault()
    if (currentSlideNo >= slides.length-1) {
        return
    } else {
    if (isChecked(slides[currentSlideNo])) {
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

const isChecked = (element) => {
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
        let ret = true
        fields.forEach(fi => {
          ret *= isValid(fi);
        })
        return ret
    }

    return isFields(fields) * isOptions(options)
}
const invalid = (field) => {
    field.style.borderBottom = "1px solid #d44"
}
const valid = (field) => {
    field.style.borderBottom = "1px solid #4d4"
}
function isValid(fi) {
    let is
     if (fi.value != '') {
                switch (fi.type) {
                    case 'text' || 'password':
                        is = true
                        !is ? invalid(fi) : valid(fi)
                        break
                    case 'email':
                        is = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(fi.value)
                        !is ? invalid(fi) : valid(fi)
                        break
                    case 'number':
                        is = true
                        !is ? invalid(fi) : valid(fi)
                        break;
                    default:
                        is = true
                        !is ? invalid(fi) : valid(fi)
                }
                info[fi.id] = fi.value
           } else {
            is = false
            invalid(fi)
           }
           return is
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
    console.log(interval)
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