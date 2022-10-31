import { query } from "./functions.js"


export const RecentPage = async() => {}

export const ListPage = async() => {

    let {result:animals} = await query({
        type:"animals_by_user_id",
        params:[sessionStorage.userId]
    });

    console.log(animals)
}

export const UserProfilePage = async() => {}

export const AnimalProfilePage = async() => {}