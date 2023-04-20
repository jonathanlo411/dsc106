function assignment3(){ 
    //Use this function to call solution functions of other questions 
    let names = ['Amy', 'Jake', 'Sara', 'Liam', 'Robert', 'Harry', 'Liam', 'Jake', 'Sara', 'Taylor', 'Kathy',                'Amy', 'Jake', 'Harry', 'Nina', 'Robert', 'Harry']
    question0()
    question1()
    question2()
    question3()
    question4()

}
question0=function(){
    document.getElementById('q0').innerHTML="Note: Here is how you can change HTML data from app.js --- Refer question0 in app.js"
}
question1=function(n){
    //This function prints the pattern mentioned in Question 1
    //You should not hard code the pattern in arrays.
    //This pattern should be generated using JS code (for loops and if-else statements)
    
}

question2=function(){
// Print the {Name:Count} data structure to the console and the names which occur more than 2 times in index.html.
       
}


question3=function(){
    //Do not change this implementation. Implement your solution inside the callback
    $.getJSON('./data.json').then(data=>{
        //Your solution goes here. Tip: try console.log(data) to see how data is structured.
        

    });
    
}
question4=function(){
    //Do not change this implementation. Implement your solution inside the callback
    $.getJSON('./data.json').then(data=>{
        //Your solution goes here. Tip: try console.log(data) to see how data is structured.
        
    })
    
}



