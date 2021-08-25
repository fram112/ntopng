/**
 * (C) 2020-21 - ntop.org
 * Script used by the network inside the Service/Periodicity Map.
 */

let network;
let updateViewStateId;
let highlightActive = false;
let nodesDataset = [];
let edgesDataser = [];

const SAVE_TIMEOUT = 500;
const MIN_SCALE = 0.15;

if (MAP === undefined) {
    console.error("The MAP constant is not defined!");
}

const defaultOptions = { 
    autoResize: true, 
    nodes: { 
        shape: "dot", 
        scaling: {
            min: 10,
            max: 30,
            label: {
                min: 8,
                max: 30,
            },
        },
        shadow: false,
    },
    edges: {
        width: 0.15,
        color: { inherit: "from" },
        smooth: {
            type: "continuous",
            roundness: 0
        },
    },
    interaction: {
        tooltipDelay: 150,
        hideEdgesOnDrag: true,
        hideEdgesOnZoom: true,
    },
    physics: {
        barnesHut: {
            springConstant: 0,
            avoidOverlap: 0.3,
            gravitationalConstant: -1000,
            damping: 0.65,
            centralGravity: 0
        },
        stabilization: {
            onlyDynamicEdges: false
        }
    },
    groups: {

        unknown: {
            shape: "dot",
        },

        printer: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf02f",
            size: 50,
            weight:"bold",
          },
        },

        video: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf03d",
            size: 50,
            weight:"bold",
          },
        },

        workstation: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf108",
            size: 50,
            weight:"bold",
          },
        },

        laptop: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf109",
            size: 50,
            weight:"bold",
          },
        },

        tablet: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf10a",
            size: 50,
            weight:"bold",
          },
        },

        phone: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf10b",
            size: 50,
            weight:"bold",
          },
        },

        tv: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf26c",
            size: 50,
            weight:"bold",
          },
        },

        networking: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf0b2",
            size: 50,
            weight:"bold",
          },
        },

        wifi: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf1eb",
            size: 50,
            weight:"bold",
          },
        },

        nas: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf1c0",
            size: 50,
            weight:"bold",
          },
        },

        multimedia: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf001",
            size: 50,
            weight:"bold",
          },
        },

        iot: {
          shape: "icon",
          icon: {
            face: "'Font Awesome 5 Free'",
            code: "\uf491",
            size: 50,
            weight:"bold",
          },
        },

    },
};

function getTimestampByTime(time) {
    if (time === undefined || time === '' || time === 'none') return undefined;
    if (time === 'day') return Math.floor(Date.now() / 1000) - 86400;
    if (time === 'week') return Math.floor(Date.now() / 1000) - 604800;
    if (time === 'month') return Math.floor(Date.now() / 1000) - 2419200;
    return Math.floor(Date.now() / 1000);
}

function saveTopologyView(network) {

    // get all nodes position
    const positions = network.getPositions(data.nodes.map(x => x.id));

    // save the nodes position, the network scale and the network view position
    const info = {
        positions: positions,
        network: {
            scale: network.getScale(),
            position: network.getViewPosition()
        }
    };

    $.post(`${http_prefix}/lua/pro/enterprise/map_handler.lua`, { ifid:ifid, JSON: JSON.stringify(info), csrf: VIEW_CSRF, map: MAP, action: 'save_view', 
        host: host,
        host_pool_id: hostPoolId,
        vlan: vlanId,
        unicast_only: unicastOnly,
        l7proto: l7proto,
        only_memory: only_memory,
        first_seen: getTimestampByTime(age),
        age: age,
     });
}

function setEventListenersNetwork(network) {

    network.on("click", function(e) {
    });

    network.on("doubleClick", function (params) {

        const target = params.nodes[0];
        const selectedNode = data.nodes.find(n => n.id == target);

        let query = "";
        // same thing for the host_pool_id
        if (hostPoolId !== "") {
            query += `&host_pool_id=${hostPoolId}`;
        }
        // for the VLAN id as well
        if (vlanId !== "") {
            query += `&vlan=${vlanId}`;
        }
        if (unicastOnly !== "") {
            query += `&unicast_only=${unicastOnly}`;
        }
        if (only_memory !== "") {
            query += `&only_memory=${only_memory}`;
        }
        if (l7proto !== "") {
            query += `&l7proto=${l7proto}`;
        }
        if (age !== "") {
            query += `&age=${age}`;
        }

        if (selectedNode !== undefined) {
            window.location.href = http_prefix + `/lua/pro/enterprise/${MAP}_map.lua?page=graph&host=` + selectedNode.id + query;
        }

    });

    network.on('zoom', function(e) {

        if (network.getScale() <= MIN_SCALE) {
            network.moveTo({
                scale: MIN_SCALE + 0.25,
                position: {x: 0, y: 0},
                animation: { duration: 1000, easingFunction: 'easeInOutCubic' }
            });
        }

        if (SAVE_TIMEOUT !== undefined) {
            clearTimeout(updateViewStateId);
        }

        updateViewStateId = setTimeout(saveTopologyView, SAVE_TIMEOUT, network);
    });

    network.on("dragEnd", function(e) {

        if (updateViewStateId !== undefined) {
            clearTimeout(updateViewStateId);
        }

        saveTopologyView(network);
    });
}

function loadGraph(container) {
    const dataRequest = { ifid: ifid, action: 'load_graph', map: MAP};
    // if an host has been defined inside the URL query then add it to the request
    const url = NtopUtils.buildURL(`${http_prefix}/lua/pro/enterprise/map_handler.lua`, {
        host: host,
        host_pool_id: hostPoolId,
        vlan: vlanId,
        unicast_only: unicastOnly,
        l7proto: l7proto,
        only_memory: only_memory,
        first_seen: getTimestampByTime(age),
        age: age,
    });

    const request = $.get(url, dataRequest);
    request.then(function(response) {
        
        data = response;

        const {nodes, edges} = data;

        // if there are no nodes then show a simple message
        if (nodes.length === 0) {
            // hide the spinner and show the message
            $(`#load-spinner`).fadeOut(function() { 
                $(this).remove(); 
                $(`#empty-map-message`).fadeIn();
            });
            return;
        }

        nodesDataset = new vis.DataSet(nodes);
        edgesDataset = new vis.DataSet(edges);
        const datasets = {nodes: nodesDataset, edges: edgesDataset};

        network = new vis.Network(container, datasets, defaultOptions);
        saveTopologyView(network);
        setEventListenersNetwork(network);
    });
}

function saveScale() {
    const scale = {width: $(`.resizable-y-container`).width(), height: $(`.resizable-y-container`).height()};
    NtopUtils.saveElementScale($(this), scale);
}

function stabilizeNetwork(network) {
    
    if (network === undefined) {
        console.error("The network is undefined!");
        return;
    }

    if (!(network instanceof vis.Network)) {
        console.error("Not a vis.Network instance!");
        return;
    }

    network.stabilize(1000);

    setTimeout(() => { saveTopologyView(network) }, 1000);

    $(`#autolayout-modal`).modal('hide');
}

(() => {
    // load old scale for resizable containers
    const oldScale = NtopUtils.loadElementScale($(`.resizable-y-container`))

    if(oldScale === undefined) {
        saveScale();
        return;
    }

    $(`.resizable-y-container`).width(oldScale.width);
    $(`.resizable-y-container`).height(oldScale.height);
})();

$(function() {

    $(`.resizable-y-container`).on('mouseup', function() {
        saveScale();
    });

    $(`button[data-toggle="tooltip"]`).tooltip();
});
