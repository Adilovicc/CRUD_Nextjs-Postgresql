import {atom} from "recoil";

export const noteFormData = atom({
    key: "noteFormData",
    default: {id:'', title: '', content: ''}
})