import {createInterface} from "readline";
import { readFile, writeFile } from 'fs';


class Node {
    /** A tag @param fornece o nome, tipo e descrição de um parâmetro de função.
     * @param {number} value
     * @param {char} c
     * @param {Node} left 
     * @param {Node} right 
     */
    constructor(value, c, left, right) {
        this.value = value;
        this.c = c;
        this.left = left;
        this.right = right;
    }
}

class Tree {
    /**
     * @param {Node} 
     */
    constructor(root) {
        this.root = root;
    }
}


//funcoes  
// cria um array para 'occurences'
function count(data) {
    occurences = new Array(128)
    for (let i = 0; i < occurences.length; i++) {
        occurences[i] = 0;
    }

    for (let i = 0; i < data.length; i++) {
        occurences[data.charCodeAt(i)]++;
    }
}

function createForest() {
    for (let i = 0; i < occurences.length; i++) {
        if (occurences[i] > 0) {
        const x = String.fromCharCode(i);
        forest.push(new Tree(new Node(occurences[i], x, null, null)));
        }
    }
}

function createTree() {
    while (forest.length > 1) {
        let minIndex = findMinimum();
        const min1 = forest[minIndex].root;


        forest.splice(minIndex, 1);

        minIndex = findMinimum();
        const min2 = forest[minIndex].root;
        forest.splice(minIndex, 1);

        forest.push(new Tree(new Node(min1.value + min2.value, null, min1, min2)));
    }
}

/**
 * @param {String} str 
 * @param {Array} code 
 * @param {Node} node 
 */

function createCode(str, code, node) {
    
    if (node == null) {
        return;
    }

    if (node.left == null && node.right == null) {
        code[node.c.charCodeAt()] = str;

    } else {
        createCode(str + '0', code, node.left);
        createCode(str + '1', code, node.right);
    }
}

function getCode(){
    let caracteres = 'Caractere | Ocorrencias | Codigo-Huffman'                
    for (let i = 0; i < code.length; i++) {
        if(occurences[i] > 0){
            caracteres += '\n' + String.fromCharCode(i) + 
            '         | ' + occurences[i] + 
            '           | ' + code[i]
        }       
    }
    return '\n' + caracteres    
}

function getText(data) {
    for (let i = 0; i < data.length; i++) {
        text += code[data.charCodeAt(i)] + ' ';
    }
}


function getAscii(data) {
    for (let i = 0; i < data.length; i++) {
        ascii += '00'.concat(data.charCodeAt(i).toString(2)).slice(-8) + ' ';
    }
}

/**
 * @return {number} 
 */
function findMinimum() {
    let min = forest[0].root.value;
    let minIndex = 0;
    for (let i = 0; i < forest.length; i++) {
        if (min > forest[i].root.value) {
        minIndex = i;
        min = forest[i].root.value;
        }
    }
    return minIndex;
}

/**
 * 
 * @param {String} str 
 * @return {Boolean} 
 */
function isASCII(str) {
    const test = /^[\x00-\x7F]*$/.test(str);
    return test;
}


let occurences = []; 
let code;
let forest; 
let ascii; 
let text = '';
let caminho = '';
let encode = '';

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question(`Digite o caminho do arquivo ex:'./src/arquivo1)':`, c => {
    caminho += ('' + c)
    readline.question(`Digite 'encode' para codificar o arquivo:`, txt => {
        encode += ('' + txt)
        if(encode == 'encode'){
            readFile(caminho, 'utf-8', function (err, data) {
                forest = [];
                ascii = '';

                if (data !== '' && isASCII(data)) {                   
                    count(data);
                    createForest();    
                    createTree();
                    code = new Array(128);
                    createCode('', code, forest[0].root);               
                    getText(data);
                    getAscii(data);
                    
                    console.log("\nDados: " + data + "\nTexto comprimido: " + text + "\nTamanho do texto comprimido: " + text.length +
                    "\nASCII: " + ascii + "\nTamanho em ASCII: " + ascii.length + "\nCompressao: " + text.length + ' / ' + ascii.length + ' = ' + (text.length / ascii.length).toFixed(4))           
                    console.log(getCode()) 

                    //reescrendo arquivo
                    writeFile('./src/cods/arq_codificado.txt', text, function(err){
                        if(err){
                            return console.log(err)
                        } 
                        console.log("\nArquivo codificado em ./src/cods/arq_codificado.txt\n")       
                    })
                   
                    readline.close()      
                } else {
                    return res.json({Erro: 'Please only enter ASCII-characters.'})
                }
                
            });
        }        
    })
});