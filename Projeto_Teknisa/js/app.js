function preRender(){
    let countVisibleCards = getCountVisibleCards();
    updateResults(countVisibleCards);
}

function getCountVisibleCards(){
    return Array.from(document.getElementsByClassName("card")).filter((card) => !card.getElementsByClassName.display || card.getElementsByClassName.display !=="none").length;
}

function updateResults(count) {
    document.getElementById("countResult").textContent = count;
}

function filter() {
    let {search, operation, languages} = getFilterProperties();
    let interval = setInterval((_) => {
        let[containerEl] = document.getElementsByClassName("container");
        let changedText = search !== getSearchValue();
        if(!changedText) clearInterval(interval);
        if(containerEl && containerEl.children && !changedText) {
            let visibleCards = updateVisibleCards(containerEl,search,operation, languages);
            updateResults(visibleCards);
        }
    }, 800);
}

function getFilterProperties() {
    let search = getSearchValue();
    let[radio] = getSelectedRadio();
    let operation = radio.id == "1" ? "AND" : "OR";
    let languages = Array.from(getSelectedLanguages()).map((lang) => lang.name);
    return {
        search,
        operation,
        languages,
    }
}

function getSearchValue(){
    let inputSearchEl = document.getElementById("nameSearch");
    return inputSearchEl.value;
}

function getSelectedRadio(){
    return Array.from(document.querySelectorAll('header input[type="radio"]:checked'));
}

function getSelectedLanguages(){
    return Array.from(document.querySelectorAll('header input[type="checkbox"]:checked'));
}

function updateVisibleCards(containerEl, search, operation, selectedLanguages){
    let visibleCards = 0;
    Array.from(containerEl.children).forEach((cardEl) => {
        let [titleEl] = cardEl.getElementsByClassName("card-title");
        let cardLanguages = Array.from(cardEl.getElementsByClassName("iconLanguage")).map((image) => image.name);
        if(titleEl) {
            let isMatchName = isMatchByName(titleEl.textContent, search);
            if(!isMatchName && operation == "AND"){
                hideCard(cardEl);
            } else if(isMatchName && operation == "OR") {
                showCard(cardEl);
                visibleCards++;
            } else if(isMatchName && operation == "AND"){
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage) {
                    showCard(cardEl);
                    visibleCards++;
                } else{
                    hideCard(cardEl);
                }
            } else if (!isMatchName && operation == "OR") {
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage){
                    showCard(cardEl);
                    visibleCards++;
                } else {
                    hideCard(cardEl);
                }
            }
        }
    });
    return visibleCards;
}

function isMatchByName(textCard, textInput) {
    return textCard.toLowerCase().includes(textInput.toLowerCase());
}

function isMatchByLanguage(cardLanguages, selectedLanguages){
    return cardLanguages.some(cardLang => selectedLanguages.includes(cardLang));
}

function hideCard(card) {
    card.style.display = "none";
};

function showCard(card) {
    card.style.display = "flex";
}

const modalTemplate = `
      <div class="modal">
        <button class="fechar">x</button>
        <div class="profilePictureModal">
            <img class="image" name ="image-profile" src="__DEV_IMAGE__" alt="desenvolvedor" />
        </div>
        <div class="profileDescriptionModal">
            <div style="display: flex; flex-direction: column">
                <h2 class="card-title" name="devname">__DEV_NAME__</h2>
                <span name="age">__DEV_AGE__</span>
                <span name="description">__DEV_DESCRIPTION__</span>
                <span name="description">__DEV_DESCRIPTION_ABILITY__</span>
                <h3>Contato</h3>
                <span name="mail">Email: <a href="#">__DEV_MAIL__</a></span>
                <span name="git">Github: <a href="#">__DEV_GIT__</a></span>
                <span name="phone">Telefone:__DEV_PHONE__</span>
            </div>
            <div class="languages">
            <h3>Linguagens</h3>
                __DEV_LANGUAGES__
            </div>
        </div>
      </div>
`;

Array.from(document.querySelectorAll('.card')).forEach(card => {
    card.addEventListener('click', () => iniciaModal('modal-profile', event.currentTarget.id));
});

function iniciaModal(modalId, cardId) {
    fillModal(getUserInfo(cardId));
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.add("mostrar");
        modal.addEventListener("click", (e) => {
            if(e.target.id == modalId || e.target.className == "fechar") {
                modal.classList.remove("mostrar")
            }
        })
    }
}

function getUserInfo(id) {
    let cardUser = document.getElementById(id);
    let userData = {};
    if(cardUser) {
        userData = ['age', 'mail', 'phone', 'github', 'username', 'description', 'descriptionAbility'].reduce((acc,name) => {
            userData.languages = 
                Array.from(cardUser.querySelectorAll("languages > .iconLanguage")).reduce(function(acc, el) {
                    let nameLanguage = el.name;
                    acc[nameLanguage] = `${el.getAttribute('experience')}`;
                    return acc;
                }, {});
                userData.picture = cardUser.querySelector( ".profilePicture > img").getAttribute('src');
            acc[name] = getTextContentByName(cardUser,name);
            return acc;
    } );
    return userData;
    } 
}

function getTextContentByName(el, name, defaultValue = "") {
    let element = el.querySelector(`*[name=${name}]`);
    return element ? element.textContent : defaultValue;
}

function fillModal(userInfo){
    let descriptionLanguages = getDescriptionLanguage();
    
    languages = Object.keys(userInfo.descriptionLanguages).map((langCode => {
        return `
            <div class="languageDescription">
                <div class="language-name">
                    <img name="${langCode}" class="iconLanguage" src="images/${langCode}.png" alt="language"/>
                    <span>${descriptionLanguages[langCode]}</span>
                </div>
                <div class="modal-experience">
                    <span>${userInfo.languages[langCode]} + Anos</span>
                </div>
            </div>
        `;
    })
    .join("\n"));
    modal = modalTemplate;
    modal = modal.replaceAll('_DEV_IMAGE_', userInfo.picture);
    modal = modal.replaceAll('_DEV_NAME_', userInfo.username);
    modal = modal.replaceAll('_DEV_AGE_', userInfo.age);
    modal = modal.replaceAll('_DEV_DESCRIPTION_', userInfo.description);
    modal = modal.replaceAll('_DEV_DESCRIPTION_ABILITY_', userInfo.descriptionAbility);
    modal = modal.replaceAll('_DEV_MAIL_', userInfo.mail);
    modal = modal.replaceAll('_DEV_PHONE_', userInfo.phone);
    modal = modal.replaceAll('_DEV_GIT_', userInfo.github);
    modal = modal.replaceAll('_DEV_LANGUAGES_', languages);
    document.querySelector('#modal-profile').innerHTML = modal;
};

function getDescriptionLanguage( ) {
    let description = {
        js: "JavaScript",
        php: "PHP",
        java: "Java",
        python: "Python",
    };
    return description;
};

