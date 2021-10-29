var add = document.getElementById("add");
var connect = document.getElementById("connect");
var remove = document.getElementById("remove");
var edit = document.getElementById("editElement");
var champ = document.getElementById("champ");
var selected = null;
var addActivated = false;
var connectActivated = false;
var connectSource = null;


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
    $('.editElement').click(function () {
        cy.$(':selected').data('label', $(".name").val());

    });

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