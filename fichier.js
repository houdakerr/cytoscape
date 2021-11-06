var add = document.getElementById("add");
var connect = document.getElementById("connect");
var remove = document.getElementById("remove");
var edit = document.getElementById("edit");
var champ = document.getElementById("champ");
var selected = null;
var addActivated = false;
var connectActivated = false;
var connectSource = null;

// Get the modal
var modal = document.getElementById("madiv");

var bouttonModif = document.createElement("input");
bouttonModif.setAttribute('type', 'button');
bouttonModif.setAttribute('id', 'Soumettre');
bouttonModif.setAttribute('value', 'Enregistrer les modifications');


document.addEventListener('DOMContentLoaded', function () {

    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),

        style: [
            {
                selector: 'node',
                style: {
                    'label': 'data(label)'
                }
            },

            {
                selector: 'node:parent',
                style: {
                    'label': ''
                }
            },

            {
                selector: 'edge',
                style: {
                    'curve-style': 'taxi',
                    'target-arrow-shape': 'triangle'
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

        elements: graph2
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
    var id = 28;
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


    cy.on("select", function (event) {
        if (selected === null) return;
        if (!connectActivated) {
            if (selected.isNode() || selected.isEdge()) {
                alert("id :" + selected.id() + " label : " + selected.data("label") + " title : " + selected.data("title"));
            }
        }

    });

    //editer
    edit.addEventListener("click", event => {

        if (selected === null) {
            alert("Veillez selectionner l'element à modifier !")
        }
        else {
            const cles = Object.keys(selected.data());
            const valeurs = Object.values(selected.data());
            for (var i = 0; i < cles.length; i++) {
                var elem2 = document.createElement("P");
                elem2.innerText = cles[i];
                var input = document.createElement("input");
                input.setAttribute('type', 'text');
                input.setAttribute('id', cles[i]);
                input.setAttribute('value', valeurs[i]);
                input.setAttribute('class', 'input');

                //  var parent = document.getElementById("madiv");
                modal.appendChild(elem2);

                modal.appendChild(input);
            }

            modal.appendChild(bouttonModif);
            // Si on clique sur modifier le modal s'ouvre
            modal.style.display = "block";




        }



    });

    // Si on clique sur enregistrer les modifications le modal se ferme

    bouttonModif.addEventListener("click", event => {
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

searchBtn.addEventListener("click", () => { // Sidebar open when you click on the search iocn
    sidebar.classList.toggle("open");
    menuBtnChange(); //calling the function(optional)
});
/*
addBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the plus iocn
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
});
edgeBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the network  iocn
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
});
delateBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the trach iocn
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
});
editBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the edit iocn
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
});
*/
// following are the code to change sidebar button(optional)
function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
    }
}