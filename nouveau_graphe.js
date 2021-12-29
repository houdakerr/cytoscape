
//les fonctionalités CRUD
var add = document.getElementById("add");
var connect = document.getElementById("connect");
var remove = document.getElementById("remove");
var edit = document.getElementById("edit");

var champ = document.getElementById("champ");
var selected = null;
var addActivated = false;
var connectActivated = false;
var connectSource = null;
var v= false;

// Get the modal
var modal = document.getElementById("madiv");
var modal2 = document.getElementById("madiv2");
var span = document.getElementsByClassName("close")[0];

//boutton modifier
var bouttonModif = document.createElement("input");
bouttonModif.setAttribute('type', 'button');
bouttonModif.setAttribute('id', 'soumettre');
bouttonModif.setAttribute('value', 'Enregistrer');

//boutton quitter  modal modifications
var bouttonAnnuler = document.createElement("input");
bouttonAnnuler.setAttribute('type', 'button');
bouttonAnnuler.setAttribute('id', 'annuler');
bouttonAnnuler.setAttribute('value','annuler' )

//boutton quitter modal informations
var bouttonFermer = document.createElement("input");
bouttonFermer.setAttribute('type', 'button');
bouttonFermer.setAttribute('id', 'fermer');
bouttonFermer.setAttribute('value','Annuler' )

//Menu contextuel context
var supprimer = document.getElementById("supprimer");
var modifier = document.getElementById("modifier");
var afficher = document.getElementById("afficher");

//titre de modal_modifications
var titre = document.createElement('P');
titre.setAttribute('type', 'text');
titre.setAttribute('id', 'titre');

//titre de modal_informations
var titre2 = document.createElement('P');
titre2.setAttribute('type', 'text');
titre2.setAttribute('id', 'titre2');

//boutton pour creer un input 
var btnAdd = document.createElement("input");
btnAdd.setAttribute("type", "button");
btnAdd.setAttribute('id', 'btnAdd');
btnAdd.setAttribute('value', '+');

document.addEventListener('DOMContentLoaded', function () {

    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),  
        layout: { name: 'dagre',
        rankDir: 'LR',
        fit:true
    },
       
       
        style: [
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                   'color': "black",
                   'text-outline-color': ' black',
                   'font-size': '15px',
                   'font-style': 'bold',
                   'text-outline-width':1,
                
                    'width': '30px',
                    'height':'30px',
                   
       
        'z-index': -1,
         

             
                }
            },
            {
                selector: 'node:parent',
                style: {
                    'borderColor': 'black',
                    "background-opacity": 0.333,
                    'background-color': 'purple',
                   
                   
                   
                }
            },


            {
                selector: 'node:parent.edge',
                style: {
                    'label': '',
                    'curve-style': 'dagre',
                    'target-arrow-shape': 'triangle'

                }
            },

            {
                selector: 'edge',
                style: {
                   
                    
                //  s'background-color': 'pink',
                   

                    'width': 4,
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'target-arrow-color': '#222635',
                    'line-color': '#222635',
                    
                    
                    'z-index': -1

                   
                }
            },

            {
                selector: '.cdnd-grabbed-node',
                style: {
                    'background-color': 'red'
                }
            },

            {
                selector: '.cdnd-drop-sibling',
                style: {
                    'background-color': 'red'
                  
                }
            },

            {
                selector: '.cdnd-drop-target',
                style: {
                    'border-color': 'red',
                    'border-style': 'dashed'
                    
                }
            
            }
        ],


  
        
        elements: {

            nodes:[],
            edges: []
        },
      
        
        /*{
            nodes: [
                { data: { id: 'a' } },
                { data: { id: 'b' } },
                { data: { id: 'c' } },
                { data: { id: 'd', parent: 'p' } },
                { data: { id: 'p' } }
            ],
            edges: [

            ]
        }*/

        
        
    });


//ajout d'un noeud au graphe

    var id = 1;
    add.addEventListener("click", event => {
        // addActivated = true;
        var top = Math.random();
        top = top * 300;
        var left = Math.random();
        left = left * 300;


        cy.add({
            group: 'nodes',
            data: { id, label: "Noeud " + id++ + "" },
            position: { x: top, y: left }
        });
        node.select();
        addActivated = false;
    });

    // ajouter une arrete

    cy.on("select", function (event) {
        if (connectActivated) {
            if (connectSource) {
                cy.add(
                    {
                        data: {
                            source: connectSource.id(),
                            target: event.target.id(),
                        }
                    }
                );
                connectActivated = false;
                connectSource = null;
                event.target.unselect();

            } else {

                connectSource = event.target;
            }
        } else {
            selected = event.target;
        }
    });

    connect.addEventListener("click", event => {
        if (selected) {
            selected.unselect();
        }
        connectActivated = true;
    });


//suppression d'un noeud ou arrete

    remove.addEventListener("click", event => {
        if (selected === null) return;
        if (selected.isNode() || selected.isEdge()) {
            id--;
            cy.remove(selected);
        }
    });
 
//editer sur la barre de navigation
    edit.addEventListener("click", event => {

        if (selected === null) {
            alert("Veuillez selectionner l'element à modifier !")
        }
          
        else  {
            if(v==false){
            v=true;
        
            const cles = Object.keys(selected.data());
            const valeurs = Object.values(selected.data());
               

          modal.appendChild(titre);
            for (var i = 0; i < cles.length; i++) {
                var elem2 = document.createElement("P");
               elem2.setAttribute('class', 'champs');
             titre.innerText= "Modifications";
                elem2.innerText = cles[i];
                var input = document.createElement("input");
                input.setAttribute('type', 'text');
                input.setAttribute('id', cles[i]);
                input.setAttribute('value', valeurs[i]);
                input.setAttribute('class', 'input');

              
                //noms des champs 
              
               modal.appendChild(elem2);
               modal.appendChild(input);
               
            }
            modal.appendChild(bouttonModif);
            modal.appendChild(bouttonAnnuler);
            modal.appendChild(btnAdd);

            // Si on clique sur modifier le modal s'ouvre
            modal.style.display = "block";
            

        }

    }

    });
   
//menu contextuel

cy.on("select", function (event) {
    if (selected === null) return;

    if (!connectActivated) {
        if (selected.isNode() || selected.isEdge()) {

                window.addEventListener("contextmenu",function(event){
                    event.preventDefault();
                    var contextElement = document.getElementById("context-menu");
                    contextElement.style.top = event.offsetY + "px";
                    contextElement.style.left = event.offsetX + "px";
                    contextElement.classList.add("active");
                  });
                  window.addEventListener("click",function(){
                  document.getElementById("context-menu").classList.remove("active");
                  });


        }
    }

}

);

 //supprimer un noeud/une arrete a partire du menu contextuel 
 supprimer.addEventListener("click", event => {
    // if (selected === null) return;
     if (selected.isNode() || selected.isEdge()) {
         id--;
         cy.remove(selected);
     }
 });
    
//afficher les infos  sur la modal  a partir du menu contextuel 
    afficher.addEventListener("click", event => {
        if (selected === null) {
            alert("Veuillez selectionner un element  !")
        }
        
            if(v==false){
            v=true;
            const cles = Object.keys(selected.data());
            const valeurs = Object.values(selected.data());
            modal2.appendChild(titre2);
            for (var i = 0; i < cles.length; i++) {
                var elem2 = document.createElement("P");
                titre2.innerText= " Informations";
                elem2.setAttribute('class', 'champs');            
                elem2.innerText = cles[i];

                var input = document.createElement("input");
                input.setAttribute('type', 'text');
                input.setAttribute('id', cles[i]);
                input.setAttribute('value', valeurs[i]);
                input.setAttribute('class', 'input');

             
                //noms des champs 
               modal2.appendChild(elem2);

               modal2.appendChild(input);

            }
           
            modal2.appendChild(bouttonFermer);
           
            // Si on clique sur modifier le modal s'ouvre
            modal2.style.display = "block";
            

        }

    }

    );

//modifier les donnéess à partir du menu contextuel
    modifier.addEventListener("click", event => {

        if (selected === null) {
            alert("Veuillez selectionner l'element à modifier !")
        }
          
        else  {
            if(v==false){
            v=true;
        
            const cles = Object.keys(selected.data());
            const valeurs = Object.values(selected.data());
               

          modal.appendChild(titre);
            for (var i = 0; i < cles.length; i++) {
                var elem2 = document.createElement("P");
               elem2.setAttribute('class', 'champs');
             titre.innerText= "Modifications";
                elem2.innerText = cles[i];
                var input = document.createElement("input");
                input.setAttribute('type', 'text');
                input.setAttribute('id', cles[i]);
                input.setAttribute('value', valeurs[i]);
                input.setAttribute('class', 'input');

               
               modal.appendChild(elem2);

               modal.appendChild(input);

            }
            
            modal.appendChild(bouttonModif);
            modal.appendChild(bouttonAnnuler);
            modal.appendChild(btnAdd);
            // Si on clique sur modifier le modal s'ouvre
            modal.style.display = "block";
            

        }

    }

    });






    // Si on clique sur enregistrer les modifications le modal se ferme

    bouttonModif.addEventListener("click", event => {
        v=false;
        const cles = Object.keys(selected.data());
      for (var i = 0; i < cles.length; i++) {

            selected.data(cles[i], document.getElementById(cles[i]).value);
        }
       
        selected = null;
        modal.style.display = "none";
      while (modal.firstChild) {
            modal.removeChild(modal.firstChild);

        }

        
       
    });


    //fin Modification
    
  



    //regroupement
    var cdnd = cy.compoundDragAndDrop();
    var removeEmptyParents = false;

    var isParentOfOneChild = function (node) {
        return node.isParent() && node.children().length === 1; 

    };

    var removeParent = function (parent) {
        parent.children().move({ parent: null });
        parent.remove();
    };

    var removeParentsOfOneChild = function () {
        cy.nodes().filter(isParentOfOneChild).forEach(removeParent);
    };

    // custom handler to remove parents with only 1 child on drop
    cy.on('cdndout', function (event, dropTarget) {
        if (removeEmptyParents && isParentOfOneChild(dropTarget)) {
            removeParent(dropTarget);
        }
    });

    // custom handler to remove parents with only 1 child (on remove of drop target or drop sibling)
    cy.on('remove', function (event) {
        if (removeEmptyParents) {
            removeParentsOfOneChild();
        }
    });

    // toggle check handler
    document.getElementById('remove-1ch-parents').addEventListener('click', function () {
        removeEmptyParents = !removeEmptyParents;

        if (removeEmptyParents) {
            removeParentsOfOneChild();
        }
    });




});

/*barre de navigation*/

let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let addBtn = document.querySelector(".bx-plus-circle");
let edgeBtn = document.querySelector(".bxs-network-chart");
let delateBtn = document.querySelector(".bx-trash");
let editBtn = document.querySelector(".bxs-edit");

closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();//calling the function(optional)
});

searchBtn.addEventListener("click", () => { // la barre de navigation s'ouvre lorsque on click sur l'icon de recherche
    sidebar.classList.toggle("open");
    menuBtnChange(); //appel a la fonction
});

// changer les options de boutton de nav
function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacer les icones 
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacer les icones
    }
}
// fin de nav 

//le boutton annuler sur modal affichage
bouttonFermer.addEventListener("click", event => {
    v=false;
    selected = null;
    modal2.style.display = "none";
  while (modal2.firstChild) {
        modal2.removeChild(modal2.firstChild);

    }
   
});

//boutton pour fermer modal de modification
bouttonAnnuler.addEventListener("click", event => {
    v=false;
    selected = null;
    modal.style.display = "none";
  while (modal.firstChild) {
        modal.removeChild(modal.firstChild);

    }
   
});




  //Affichage en Format Cose (animation)
  document.getElementById("layoutButton").addEventListener("click", function() {
    var layout = cy.layout({
      name: "cose-bilkent",
      animate: "end",
      animationEasing: "ease-out",
      animationDuration: 1000,
      randomize: true
    });

    layout.run();
  });

 //ajout des nouvelle infos sur modal
var x=0;
var tracklist = document.querySelector('.tracklist');

btnAdd.addEventListener("click", event => {
    
    x = x+2;
//ajouter le nom du champ  
  var newLabel = document.createElement('input');
  newLabel.setAttribute('id', 'newLabel');
  newLabel.setAttribute('placeholder', 'label');
  newLabel.classList.add('track' + x);

  //ajouter le contenu de l'élement 
  var newInput = document.createElement('input');
  newInput.setAttribute('id', 'newInput');
  newInput.setAttribute('placeholder', 'data');
  newInput.classList.add('track' + x);
  
  modal.appendChild(newLabel);
  modal.appendChild(newInput);

});