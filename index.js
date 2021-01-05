const body_div = document.getElementById("body_container");
const barrier_button = document.getElementById("barrier_div");
const start_button = document.getElementById("start_div");
const end_button = document.getElementById("end_div");
const single_clear_button = document.getElementById("clear_div")
const clear_button = document.getElementById("clear_all_div")
const start_path = document.getElementById("start_path")


var start = null;
var end = [];
var mode = "s";
var pathType = "dij";

var height = 15
var width = parseInt(body_div.clientWidth/38)
var dijDict = {}

for (let i = 0; i < height; i++){
    var row = document.createElement("div")
    row.classList.add("row")
    row.setAttribute("id", "" + i)
    for (let j = 0; j < width; j++){
        let id = i + " " + j;
        var col = document.createElement("div")
        col.setAttribute("id", id)
        col.classList.add("box")
        row.appendChild(col)
        let arrId = [i, j]
        // dijDict[arrId.toString()] = []
    }
    body_div.appendChild(row)
}

var num = 0;

var barriers = []

barrier_button.onclick = function(){mode = "b"}
start_button.onclick = function(){mode = "s"}
end_button.onclick = function(){mode = "e"}
single_clear_button.onclick = function(){mode = "c"}
clear_button.onclick = function(){clear()}
start_path.onclick = function(){//if (num == 0){
    start_pathing();
    //  num++}
    }

body_div.onmouseover = function(){
    let rows = body_div.getElementsByClassName("row")
    for (let i = 0; i < rows.length; i++){
        rows[i].onmouseover = function(){
            let boxes = rows[i].getElementsByClassName("box")
            for (let j = 0; j < boxes.length; j++){
                boxes[j].onclick = function(){
                    pickClicked(boxes[j])
                }
            }
        }
    }
}

function clear(){
    rows = body_div.getElementsByClassName("row");
    for (let i = 0; i < rows.length; i++){
        boxes = rows[i].getElementsByClassName("box");
        for (let j = 0; j < boxes.length; j++){
            if (boxes[j].classList.contains("barrier")){
                boxes[j].classList.remove("barrier")
            }
            if (boxes[j].classList.contains("start")){
                boxes[j].classList.remove("start")
            }
            if (boxes[j].classList.contains("end")){
                boxes[j].classList.remove("end")
            }
            if (boxes[j].classList.contains("searching")){
                boxes[j].classList.remove("searching")
            }
            if (boxes[j].classList.contains("searched")){
                boxes[j].classList.remove("searched")
            }
            if (boxes[j].classList.contains("path")){
                boxes[j].classList.remove("path")
            }
        }
    }
}

function pickClicked(box){

    if (mode === "b"){

        let boxID = box.id.split(" ")
        let boxIndex = [parseInt(boxID[0]), parseInt(boxID[1])]
        if (box.classList.contains("barrier")){
            box.classList.remove("barrier")
            for (let i = 0; i < barriers.length; i++){
                if (compArr(barriers[i], boxIndex)){
                    barriers.splice(i, 1)
                }
            }
        }
        else{
            box.classList.add("barrier")
            barriers.push(boxIndex)
        }
    }
    else if (mode === "s"){
        if (box.classList.contains("start")){
            box.classList.remove("start")
        }
        else{
            prevStart = checkFor("start")
            if (prevStart){
                body_div.getElementsByClassName("row")[prevStart[0]].getElementsByClassName("box")[prevStart[1]].classList.remove("start")
                box.classList.add("start")
            }
            else{
                box.classList.add("start")
            }
            // start.push(box)
        }
    }
    else if (mode === "e"){
        if (box.classList.contains("end")){
            let boxID = box.id.split(" ")
            let boxIndex = [parseInt(boxID[0]), parseInt(boxID[1])]
            box.classList.remove("end")
            for (let i = 0; i < end.length; i++){
                if (compArr(end[i], boxIndex)){
                    barriers.splice(i, 1)
                }
            }
            
        }
        else{
            box.classList.add("end")
            let thingie = searchFor(box)
            end.push(thingie)
        }
    }
    else if (mode === "c"){
        box.classList.remove("start")
        box.classList.remove("barrier")
        box.classList.remove("end")
    }
}

function checkFor(type){
    rows = body_div.getElementsByClassName("row");
    for (let i = 0; i < rows.length; i++){
        boxes = rows[i].getElementsByClassName("box");
        for (let j = 0; j < boxes.length; j++){
            if (boxes[j].classList.contains(type)){
                return [i, j]
            }
        }
    }
    return null
}

function searchFor(box){
    rows = body_div.getElementsByClassName("row");
    for (let i = 0; i < rows.length; i++){
        boxes = rows[i].getElementsByClassName("box");
        for (let j = 0; j < boxes.length; j++){
            if (boxes[j] === box){
                return [i, j]
            }
        }
    }
    return null
}

function start_pathing(){
    if (checkFor("start") && checkFor("end")){
        if (pathType === "dij"){
            dijkstra()
        }
    }
}
var tree = []

var searched = []
var searching = []
function dijkstra(){
    /*
    1) create a primary list that will contain all paths
    2) starting from the start node, for each node, go around
        it for adjacent nodes and do the sutff
    3) each time check if the end node is in the tree, if yes break
    4) recursively go through the tree until the end node is found 
        and then mark all those as "path class"
    */
   start = checkFor("start")
   searching = [start]
   dijDict[start.toString()] = [start]
   console.log(end)
    let interval = setInterval(function(){

    if (searching.length === 0){
        clearInterval(interval)
        searching = []
        searched = []
    }
    for (let j = 0 ; j < end.length; j++){
        for (let i = 0; i < searching.length; i++){
            if (compArr(searching[i], end[j])){
                clearInterval(interval)
                searching = []
                searched = []
                let index = end[j]
                let st = index.toString()
                let path = dijDict[st]

                for (let k = 0; k < path.length; k++){
                    let box = body_div.getElementsByClassName("row")[path[k][0]].getElementsByClassName("box")[path[k][1]]
                    box.classList.add("path")
                }

            }

        }
    }
        dijkstraHelper()
   },50)
}

function compArr(arr1, arr2){
    if (arr1.length === arr2.length){
        for (let i = 0; i < arr1.length; i++){
            if (arr1[i] != arr2[i]){
                return false
            }
        }
        return true
    }
    else{
        return false
    } 
}
function dijkstraHelper(){

    let arr = []

    let branch = []
    for (let i = 0; i < searching.length; i++){
        let node = searching[i]
        let path = dijDict[node.toString()]
        if (node[0] > 0){
            let newnode = [node[0]-1, node[1]]
            if (!thingisinlist(barriers, newnode)
             && !thingisinlist(arr, newnode) && 
             !thingisinlist(searched, newnode) 
             && !thingisinlist(searching, newnode)){
                 let newPath = path.slice()
                 newPath.push(newnode)
                 dijDict[newnode] = newPath
                arr.push(newnode)
                for (let j = 0; j < end.length; j++){
                    if (compArr(end[j], newnode)){
                        console.log("walkda")
                    }
                }
            }
        }
        if (node[1] > 0){
            let newnode = [node[0], node[1]-1]
            if (!thingisinlist(barriers, newnode)
             && !thingisinlist(arr, newnode) &&
              !thingisinlist(searched, newnode) && 
            !thingisinlist(searching, newnode)){
                let newPath = path.slice()
                newPath.push(newnode)
                dijDict[newnode] = newPath
                arr.push(newnode)
                for (let j = 0; j < end.length; j++){
                    if (compArr(end[j], newnode)){
                        console.log("walkda")
                    }
                }
            }
        }
        if (node[0] < height-1){
            let newnode = [node[0]+1, node[1]]
            if (!thingisinlist(barriers, newnode) && 
            !thingisinlist(arr, newnode) && 
            !thingisinlist(searched, newnode) &&
             !thingisinlist(searching, newnode)){
                let newPath = path.slice()
                newPath.push(newnode)
                dijDict[newnode] = newPath
                arr.push(newnode)
                for (let j = 0; j < end.length; j++){
                    if (compArr(end[j], newnode)){
                        console.log("walkda")
                    }
                }
            }
        }
        if (node[1] < width-1){
            let newnode = [node[0], node[1]+1]
            if (!thingisinlist(barriers, newnode) &&
             !thingisinlist(arr, newnode) &&
              !thingisinlist(searched, newnode) &&
               !thingisinlist(searching, newnode)){
                let newPath = path.slice()
                newPath.push(newnode)
                dijDict[newnode] = newPath
                arr.push(newnode)
                for (let j = 0; j < end.length; j++){
                    if (compArr(end[j], newnode)){
                        console.log("walkda")
                    }
                }
            }
        }
    }
    tree.push(branch)

    for (let i = 0; i < searching.length; i++){
        let node = searching[i]
        let box =  body_div.getElementsByClassName("row")[node[0]].getElementsByClassName("box")[node[1]]
        box.classList.remove("searching")
        box.classList.add("searched")
        searched.push(node)
    }
    searching = []

    for (let i = 0; i < arr.length; i++){
        let node = arr[i]
        let box = body_div.getElementsByClassName("row")[node[0]].getElementsByClassName("box")[node[1]]
        box.classList.add("searching")
        searching.push(node)
    }
    arr = []
}

function clearAllIntervals(){
    var interval_id = window.setInterval("", 9999); // Get a reference to the last
                                                // interval +1
    for (var i = 1; i < interval_id; i++){
        window.clearInterval(i);
    }
}

function thingisinlist(list, thing){
    for (let i = 0; i < list.length; i ++){
        let node = list[i]
        if (compArr(node, thing)){
            return true
        }
    }
    return false
}
