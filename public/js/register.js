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
    } 
    }
    console.log(info)
}
previous.onclick = () => {
    if (currentSlideNo <= 0) {
        previous.style.display = 'hidden'
        return
    }
    previous.style.display = 'block'
    slides[currentSlideNo].style.display = 'none'
    slides[--currentSlideNo].style.display = 'flex'
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