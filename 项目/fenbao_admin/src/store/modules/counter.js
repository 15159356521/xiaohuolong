import {createSlice} from '@reduxjs/toolkit';
const account=createSlice({
    name: 'account',
    initialState: {
        nickname: "游客",
        id: 0,
        token: "",
        app_id: 55445456465499,
        direction: "不限",
        length: "40~300秒",
        type: "个人",
        card_id: "350******45646",
        name: "高**",
        phone: "138****1234",
        avatar:"../../../assets/xhl.png",
        type: "个人",


    },
    reducers: {
        add(state,action) {
         console.log("add",state,action.payload)
            state.nickname=action.payload.names  
            state.id=action.payload.id
            state.token=action.payload.token
            state.app_id=action.payload.app_id
            state.direction=action.payload.direction
            state.length=action.payload.length
            state.type=action.payload.type
            state.card_id=action.payload.card_id
            state.name=action.payload.name
            state.phone=action.payload.phone
            // state.avatar=action.payload.avatar
            state.type=action.payload.type

            
        }
    }
});
export const {add}=account.actions;
export default account.reducer;