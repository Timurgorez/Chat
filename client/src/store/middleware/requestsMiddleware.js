// import CryptoJS from "crypto-js";
// import jsonp from 'jsonp';
//
// import * as actionTypes from '../apiData/actionTypes';
//
// export const runAPImiddleware = storeAPI => next => action => {
//     if (action.type === actionTypes.SET_CONFIG) {
//         console.log('runAPImiddleware', storeAPI.getState().api.config);
//         // get('todos').then(todos => {
//         //     // Dispatch an action with the todos we received
//         //     storeAPI.dispatch({ type: 'todos/todosLoaded', payload: todos })
//         // })
//         const {dispatch} = storeAPI;
//         const { config } = storeAPI.getState().api;
//
//         const runAPI = async (method, startDate = '', endDate = '', folder = null, nextPage = '', options = '') => {
//
//             const { account, region, key, settingId } = config;
//
//             let dateStr = "";
//             if(nextPage){
//                 dateStr = nextPage;
//             }else if(startDate && endDate){
//                 dateStr = 'FromDate='+ startDate.toISOString() +'&ToDate='+ endDate.toISOString();
//
//             }
//
//             var auth = account + ":" + settingId + ":" + new Date().getTime();
//             var authHash = auth + ":" + CryptoJS.SHA512(auth + key).toString(CryptoJS.enc.Hex);
//
//
//             var url = "https://api-" + region +
//                 ".boldchat.com/aid/" + account +
//                 "/data/rest/json/v2/" + method +
//                 "?auth=" + authHash +
//                 (selectedFolders.length > 0 && folder ? "&FolderID=" + folder.FolderID : "") +
//                 (dateStr ? "&" + dateStr : "") +
//                 (options ? "&" + options : "");
//
//             await jsonp(url, null, (err, data) => {
//                 if (err) {
//                     console.error('ERROR ____>>>', err.message);
//                     dispatch(showAlert('Bad request!', 500));
//                 } else {
//                     console.log('DATA', data);
//                     switch (method){
//
//                         case "getInactiveChats":
//                             if(data.Status && data.Status == 'success'){
//                                 const columns = [];
//                                 if (data.Data && data.Data[0]) {
//                                     const columnsArr = Object.keys(data.Data[0]);
//                                     const col = columnsArr.map((column, idx) => {
//                                         const obj = {};
//                                         // obj['id'] = idx + 1;
//                                         obj['field'] = column;
//                                         obj['title'] = column;
//                                         obj['width'] = 150;
//
//                                         obj['formatter'] = function (cell, formatterParams) {
//                                             const colName = cell.getColumn()._column.field;
//                                             const value = cell.getValue();
//                                             if(customeDataArr[colName] && customeDataArr[colName][value]){
//                                                 return customeDataArr[colName][value];
//                                             }else{
//                                                 return value;
//                                             }
//                                         };
//                                         return obj;
//                                     });
//
//
//                                     columns.push(...col);
//
//                                 }
//
//                                 temporaryArr.push(...data.Data);
//
//                                 if (typeof data.NextPage !== 'undefined') {
//                                     var nextdates = "NextPage=" + data.NextPage;
//                                     runAPI("getInactiveChats", config, startDate, endDate, folder, nextdates);
//                                 }else{
//                                     console.log('columns and FinalDATA--> ', columns, temporaryArr);
//                                     // setColumns(columns);
//                                     // setData(temporaryArr);
//                                     dispatch(setDataAction(temporaryArr));
//                                     dispatch(setColumnsAction(columns));
//                                     dispatch(showAlert('Bad request!', 500));
//                                 }
//                             }else{
//                                 // setHintBlockShow(false);
//                                 // setLoading(false);
//                                 // toast.error(t => (
//                                 //         <ErrorNotification t={t} toast={toast} title="Request error" text="You have incorrect settings account or bad request." />
//                                 //     ),{
//                                 //         duration: 3000000,
//                                 //     }
//                                 // );
//                             }
//
//                             break;
//
//                         case "getOperators":
//                             console.log("getOperators", data);
//                             if(data.Status && data.Status == 'success'){
//                                 if(data.Data && data.Data.length > 0) {
//
//                                     const selectData = data.Data;
//                                     selectData.unshift({LoginID: '', ChatName: ''});
//                                     setOperators(data.Data);
//                                 }
//                                 // setLoading(false);
//                             }else{
//                                 // setHintBlockShow(false);
//                                 // setLoading(false);
//                                 // toast.error(t => (
//                                 //         <ErrorNotification t={t} toast={toast} title="Request error" text="You have incorrect settings account or bad request." />
//                                 //     ),{
//                                 //         duration: 3000000,
//                                 //     }
//                                 // );
//                             }
//
//                             break;
//                         case "getFolders":
//                             if(data.Status && data.Status == 'success'){
//                                 if(data.Data && data.Data.length > 0){
//                                     console.log("getFolders", data);
//                                     // setFolders(data.Data)
//                                 };
//                                 // setLoading(false);
//                             }else{
//                                 // setHintBlockShow(false);
//                                 // setLoading(false);
//                                 // toast.error(t => (
//                                 //         <ErrorNotification t={t} toast={toast} title="Request error" text="You have incorrect settings account or bad request." />
//                                 //     ),{
//                                 //         duration: 3000000,
//                                 //     }
//                                 // );
//                             }
//
//                             break;
//                         case "getChat":
//                             if(data.Status && data.Status == 'success'){
//                                 if(data.Data){
//                                     console.log("getChat", data);
//                                     const arr = [];
//                                     arr.push(data.Data);
//                                     console.log("ARRR", arr);
//                                     setDetailsChatData(arr);
//                                 };
//                                 // setLoading(false);
//                             }else{
//                                 // setHintBlockShow(false);
//                                 // setLoading(false);
//                                 // toast.error(t => (
//                                 //         <ErrorNotification t={t} toast={toast} title="Request error" text="You have incorrect settings account or bad request." />
//                                 //     ),{
//                                 //         duration: 3000000,
//                                 //     }
//                                 // );
//                             }
//
//                             break;
//                     }
//
//                 }
//             });
//         };
//     }
//
//     return next(action);
// };