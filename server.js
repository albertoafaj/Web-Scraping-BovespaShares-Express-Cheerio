const express = require('express')
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const app = express()
let arraySelection = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
let result = []
let arraySelectionIndex = 0

app.get('/data', (req, res) => {

    arraySelection.forEach( function (e) {
        
        url = `https://br.advfn.com/bolsa-de-valores/bovespa/${e}`
        
        request(url, function(error, response, html) {
            
            if (!error) {
                
                const $ = cheerio.load(html)
                
                arraySelectionIndex++
                
                $('.atoz_link_table td.Column1').each( function(e) {
                    
                    const nameCompany = $(this).text()
                    const codeShareBovespa = $(this).next().text()
                    
                    result.push({
                        nameCompany: nameCompany,
                        codeShareBovespa: codeShareBovespa 
                    })
                    
                })
                
                if(arraySelectionIndex===arraySelection.length){
                    
                    fs.writeFile('result.json', JSON.stringify(result, null, 4), function(err) {
                        console.log('JSON written successfully! The file is at the root of the project')
                    })
                    
                }
                
            }
            
        })   
        
        
        
    }) 
})

app.listen('8052', console.log('Running data collection on port 8052'))

exports = module.exports = app