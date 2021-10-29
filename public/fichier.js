//déclaration des différentes variables 
var add = document.getElementById("add");
var connect = document.getElementById("connect");
var remove = document.getElementById("remove");
var redraw = document.getElementById("redraw");
var undo = document.getElementById("undo");
var redo = document.getElementById("redo");
var validate = document.getElementById("validate");
var edit = document.getElementById("editElement");
var champ = document.getElementById("champ");

//
var selected = null;
var addActivated = false;
var connectActivated = false;
var connectSource = null;

var layout = {
    name: "dagre",
    directed: true,
    nodeDimensionsIncludeLabels: true,
};
 

// cytoscape style
let style = [{
    'selector': 'node',
    'style': {
        'shape': 'ellipse',
        'width': 'mapData(weight, 40, 80, 20, 60)',
        'content': 'data(id)',
        'text-valign': 'center',
        //'text-outline-color': 'data(faveColor)',
        'background-color': 'blue',
        'color': '#000'
    }
}, 

{
    selector: ":selected",
    style: {
        "background-color": "tomato",
        "line-color": "tomato",
        "target-arrow-color": "tomato",
        opacity: 1
    }
},{
    'selector': ':selected',
    'style': {
        'border-width': 3,
        'border-color': '#333'
    }
}, {
    'selector': ':parent',
    'style': {
        'background-opacity': 0.333
    }
}, {
    'selector': 'edge',
    'style': {
        'curve-style': 'taxi',
        'taxi-direction': auto,
        'taxi turn': '20 px',
        
        'opacity': 0.666,
        'width': 4,
        //arc oriente
        'line-color': 'black',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': 'yellow'/*,
        'line-color': 'data(faveColor)',
        'source-arrow-color': 'data(faveColor)',
        'target-arrow-color': 'data(faveColor)'*/
    }
}, {
    'selector': 'edge.questionable',
    'style': {
        'line-style': 'dotted',
        'target-arrow-shape': 'diamond'
    }
}, {
    'selector': '.faded',
    'style': {
        'opacity': 0.25,
        'text-opacity': 0
    }
}];


//fonction chargement 

    ////fin de la fct
//fonction 2

var cy = Window.cy = cytoscape({
    container: document.getElementById("cy"),

    layout,

    style: style
    /* [
        {
            //style des noeuds crées
            selector: "node",
            //style des noeuds crées
            style: {
                content: "data(label)",
                "text-opacity": 1,
                "text-valign": "center",
                "text-halign": "center",
                width: "label",
                padding: "10px",
                "background-color": "blue",
                color: "#fff",
                shape: "circle"
                // 'text-outline-width': 2,
                // 'text-outline-color': '#888',
            }
        },
        {
            selector: "edge",
            style: {
                "curve-style": "bezier",
                width: 4,
                //arc orienté
                "target-arrow-shape": "triangle",
                "line-color": "black",
                "target-arrow-color": "#9dbaea"
            }
        },
        {
            selector: ":selected",
            style: {
                "background-color": "tomato",
                "line-color": "tomato",
                "target-arrow-color": "tomato",
                opacity: 1
            }
        }
    ]*/,

    elements: graph2
    /*  [
         { data: { id: "n1", label: 'Noeud 1' } },
         { data: { id: "n2", label: 'Noeud 2' } },
         { data: { id: "n3", label: 'Noeud 3' } },
         { data: { id: "n4", label: 'Noeud 4' } },
         { data: { id: "n5", label: "Noeud 5" } },
         { data: { source: "n1", target: "n2" } },
         { data: { source: "n1", target: "n3" } },
         { data: { source: "n2", target: "n4" } },
         { data: { source: "n3", target: "n4" } },
         { data: { source: "n4", target: "n5" } }
     ]*/
});



//
cy.on('data', '*', event => console.log(event))

var ur = cy.undoRedo();
var id = 1;

cy.on("tap", event => {
    if (addActivated && event.target === event.cy) {
        var node = ur.do("add", {
            data: { id, id: "Noeud " + id++ + "" },
            position: event.position

        });
        node.select();
        addActivated = false;
    }
});

cy.on("select", function (event) {
    if (connectActivated) {
        if (connectSource) {
            if (connectSource.edgesTo(event.target).empty()) {
                ur.do("add", {
                    data: {
                        source: connectSource.id(),
                        target: event.target.id(),
                    }
                });
            }
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

add.addEventListener("click", event => {
    addActivated = true;
});

connect.addEventListener("click", event => {
    if (selected) {
        selected.unselect();
    }
    connectActivated = true;
});

remove.addEventListener("click", event => {
    if (selected === null) return;
    if (selected.isNode() || selected.isEdge()) {
        id--;
        ur.do("remove", selected);
    }
});



$('#validate').click(function () {
    eh.hide();
    var diagramJson = cy.json();
    console.log(diagramJson)

    var formattedData = JSON.stringify(diagramJson.elements, null, '\t').replace(/"([^"]*)":/g, '$1:');
    console.log(diagramJson.elements)
    $('.savedJson').text(formattedData);
});


$('.editElement').click(function () {
    cy.$(':selected').data('id', $(".name").val());
});

redraw.addEventListener("click", event => {
    ur.do("layout", { options: layout });
});

undo.addEventListener("click", event => {
    ur.undo();
});

redo.addEventListener("click", event => {
    ur.redo();
});

/*validate.addEventListener("click", event => {
    console.log('hasCycles', hasCycles(cy.elements()));
});

function hasCycles(elements) {

    const visited = []
    const bfs = elements.bfs({
        directed: true,
        roots: elements.roots(),
        visit: (node) => {
            visited.push(node);
            const children = node.outgoers().nodes();
            if (children.anySame(visited)) {
                return true;
            }
        },
    });

    return bfs.found.length !== 0;
}
 
*/
//code ens

document.addEventListener('DOMContentLoaded', function() { // on dom ready
    var toJson = function(res){ return res.json(); };

    var cy = cytoscape({
        container: document.querySelector('#cy'),
        
        layout: {
            name: 'dagre',
            rankDir: 'LR',
            fit:true
        },
        
        style: style, //fetch('cy-style.json').then(toJson),
        
        elements: graph ,
		elements: json2Elements(doc),
		elements: fetch('http://vps-e9e90ee3.vps.ovh.net:5000/lecons_detail').then(toJson)
    });})