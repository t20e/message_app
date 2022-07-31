import axios from "axios"

export const pullData = (url, reqData) => {
    axios.get(`http://localhost:8000${url}`, reqData, { withCredentials: true })
        .then(res => {
            console.log(1);
            console.log("response from server: ", res);
            return (res.data)
        })
        .catch(err => {
            console.log("err getting  users ", err);
        })
}
// export const pullData = (url, reqData) => {
//     return new Promise(function (resolve, reject) {
//         axios.get(`http://localhost:8000${url}`, reqData, {withCredentials:true})
//         .then(res => {
//             console.log(1);
//             console.log("response from server: ", res);
//             //resolve is what the other call .then() function gets returned
//                 resolve(res.data)
//             })
//             .catch(err => {
//                 console.log("err getting  users ", err);
//                 reject(err)
//                 //reject is what the catch() gets
//             })
//     })
// }


