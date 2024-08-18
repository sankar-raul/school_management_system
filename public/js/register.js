const allInput = document.querySelectorAll('input:not(input[type="submit"])')
const varifyEmail = document.getElementById('email-varify')
for (let i of allInput) {
    i.addEventListener('mouseover', (e) => {
        e.target.focus()
    })
    i.addEventListener('blur', (e) => {
        e.target.id != 'otp' && isValid(e.target)
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
        if (res) {
            alert(res)
        }
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
    // console.log(info) // for development debuging
}


// do it >>>>
const otpField = document.getElementById('otp')
const varifyAndSubmit = async () => {
    if (otp.value.length == 6 && otp.value != info.otp) {
        info.otp = otp.value
        try {
        let res = await vAndSub()
        if (res == 'varified') {
            res = true
            valid(otpField)
            removeErrMsg(otpField)
        } else if (res == 'not varified') {
            res = false
            invalid(otpField)
            showErrMsg(otpField, "invalid otp!")
        } else if (res == "expired") {
            res = false
            invalid(otpField)
            showErrMsg(otpField, "otp expired!")
        } else {
            invalid(otpField)
            alert(res)
            showErrMsg(otpField, "unexpected error!")
        }
        return res;
    } catch (e) {
        return false
    }
    } else {
        invalid(otpField)
        showErrMsg(otpField, "invalid otp!")
        return false
    }
}
let vAndSubController = null
const vAndSub = async () => {
    if (vAndSubController) {
        vAndSubController.abort("overlap")
    }
    vAndSubController = new AbortController()
    const isDone = await fetch(`/students/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info),
        signal: vAndSubController.signal
    })
    return isDone.text()
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
                let flag = null
                if (is) {
                if (fi.classList.contains("unique")) {
                    if (fi.value != info[fi.id]) {
    
                    is = await isExits([fi.id, fi.value])
                    removeErrMsg(fi)
                    if (is == 'abort') {
                        is = false
                        return is
                    } else {
                        is = !is
                        if (!is) {
                            showErrMsg(fi, "already exists!")
                            flag = true
                        } else {
                            removeErrMsg(fi)
                            flag = false
                        }
                    }
                } else {
                    const label = document.querySelector(`label[for="${fi.id}"]`)
                    if (label.children[0]) {
                        showErrMsg(fi, "already exists!")
                        flag = true
                        is = false
                    } else {
                        is = true
                        flag = false
                    }
                }
                }
            }
                if (!is) {
                    if (!flag) {
                        showErrMsg(fi, `invalid ${fi.id}!`)
                    }
                    invalid(fi)
                } else {
                    removeErrMsg(fi)
                    valid(fi)
                }
                info[fi.id] = fi.value
                return is
           } else {
            is = false
            invalid(fi)
            showErrMsg(fi, `invalid ${fi.id}!`)
            return is
           }
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
        otpTimesout = 'not null'
        otpInfo.children[2].style.display = 'none'
        fetch("/students/otp", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({email: info.email})
        }).then((data) => data.text())
        .then(msg => {
            if (msg == 'success') {
                startCouter()
                resolve(true)
            } else if (msg == 'failed') {
                startCouter({failed: true})
                resolve(false)
            } else {
                startCouter({failed: true})
                console.log("registration", msg)
                resolve(false)
            }
        })
    }) //// / gb/ / g/ /t// s
} // ok
var counterInterval, otpTimesout = null
function startCouter(flag) {
    const isFailed = flag ? flag.failed ? true : false : false
    if (!isFailed) {
        console.log(isFailed)
    let count = 30
    otpInfo.children[0].innerHTML = "<span>Otp sent!</span>"
    counter.innerHTML = "resend after " + count
    counter.style.display = 'block'
    otpInfo.children[2].style.display = 'none'
    counterInterval = setInterval(() => {
        counter.innerHTML = "resend after " + --count
        }, 1000)
    otpTimesout = setTimeout(() => {
        clearInterval(counterInterval)
        counterInterval = null
        otpInfo.children[2].style.display = 'block'
        counter.style.display = 'none'
        otpTimesout = null
    }, 30000)
} else {
    otpInfo.children[0].innerHTML = "<span>Otp not sent!</span>"
    otpInfo.children[2].style.display = 'block'
}
}
resend.onclick = (e) => {
    if (otpTimesout == null) {
        newOtp()
    }
}
let controller
const previousRequests = {}
async function isExits([type, id]) {
    controller = new AbortController()
    if (previousRequests[type]) {
        previousRequests[type].abort("abort")
    }
    previousRequests[type] = controller
    try {
    const res = await fetch(`/students/check?${type}=${id}`, {signal: controller.signal})
    const response = await res.text()
    if (response == "exists") {
        return true
    } else if (response == "not exists") {
        return false
    } else {
        console.log(response)
        return true
    }
} catch (error) {
    return "abort"
}
}