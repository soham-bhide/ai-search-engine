import {createClient} from "../lib/client";
const supabase = createClient();

export default function Auth(){

    async function login(provider:"Github"){
        const {data,error} = await supabase.auth.signInWithOAuth({
            provider:"github"
        })
    }

    return(
        <div>
        <button onClick={()=>login("Github")}>Login with Github</button>
        </div>
    )
}