/**
 * Visualization of a Hierarchical, Granular Knowledge Cube
 * @author Blaise ROSSIER
 * Prototype
 * 2015-2016
 * GPLv3
 */
var itemsScalabilityNumber = 12,
 previousStack = [],
 current = "",
 nextStack = [],
 context = [];

function _concepts() {
 return Object.keys(cube.concepts);
}

function _conceptEntities(c) {
 return cube.concepts[c].entities;
}

function _conceptGranules(c) {
 return cube.concepts[c].granules;
}

function _conceptIdentifier(c) {
 return cube.concepts[c].identifier;
}

function _conceptLevel(c) {
 return cube.concepts[c].level;
}

function _conceptRelations(c) {
 return cube.concepts[c].relations;
}

function _entityConcepts(e) {
 return cube.entities[e].concepts;
}

function _entityUrl(e) {
 return cube.entities[e].url;
}

function _granuleColor(g) {
 return cube.granules[g].color;
}

function _granuleConcepts(g) {
 return cube.granules[g].concepts;
}

function _granuleDependencies(g) {
 return cube.granules[g].dependencies;
}

function _levels() {
 return Object.keys(cube.levels);
}

function _levelConcepts(l) {
 return cube.levels[l].concepts;
}

function _relationConcepts(r) {
 return cube.relations[r].concepts;
}

function _relationLabel(r) {
 return cube.relations[r].label;
}

function _conceptGranulesGranulesConcepts(c) {
 var granules = new Set();
 _conceptGranules(c).forEach(function(g) {
  granules.add(g);
  _granuleDependencies(g).forEach(function(d) {
   granules.add(d)
  });
 });
 var concepts = new Set();
 granules.forEach(function(g) {
  _granuleConcepts(g).forEach(function(c) {
   concepts.add(c);
  });
 });
 return Array.from(concepts);
}

function _conceptRelationsConcepts(c) {
 var concepts = new Set();
 concepts.add(c) //root
 _conceptRelations(c).forEach(function(r) {
  _relationConcepts(r).forEach(function(c) {
   concepts.add(c);
  });
 });
 return Array.from(concepts);
}

function conceptEntitiesVisualization(c) {
 visualizationsStack("conceptEntitiesVisualization('" + c + "')");
 var containers = document.getElementById('containers');
 containers.innerHTML = "";
 normalize();
 itemSetActive('entitiesFeedback', 'conceptFeedback');
 [].slice.call(document.getElementById('sort').getElementsByClassName('barItem')).forEach(function(i) {
  i.classList.remove('interactive', 'active');
 });
 [].slice.call(document.getElementById('vertical').getElementsByClassName('barItem')).forEach(function(i) {
  i.classList.remove('active', 'dottedBackground');
 });
 context = [];
 var entitiesHTML = "";
 _conceptEntities(c).forEach(function(e) {
  entitiesHTML += '<p class="item"><i title="Visualize the concepts in this entity" onclick="entityConceptsVisualization(\'' + e + '\')" class="fa fa-th" style="margin-right: 25px; "></i> <a target="_blank" href="' + _entityUrl(e) + '">' + _entityUrl(e) + '</a></p>';
 });
 var HTML = '<div style="margin-left: 50px;"><h1>The concept <span style="font-style: italic">' + _conceptIdentifier(c) + '</span> is extracted from the following entities:</h1>' + entitiesHTML + '</div>';
 containers.innerHTML = HTML;
}

function conceptGranulesGranulesConceptsVisualization(c) {
 visualizationsStack("conceptGranulesGranulesConceptsVisualization('" + c + "')");
 context = _conceptRelationsConcepts(c);
 layout(_conceptGranulesGranulesConcepts(c));
 normalize();
 itemSetActive('conceptFeedback', 'puzzleFeedback');
 var y = document.getElementById(document.getElementById(c).parentNode.getAttribute('id')).getBoundingClientRect().y;
 window.scrollBy(0, y - 100);
}

function conceptRelationsConceptsHighlight(c) {
 var root = c;
 var concept = document.getElementById(c);
 var concepts = [].slice.call(document.getElementsByClassName('conceptItem')).map(function(i) {
  return i.getAttribute('id')
 });
 concept.onmouseout = function() {
  concepts.forEach(function(c) {
   document.getElementById(c).style.opacity = 1;
   document.getElementById(c).classList.remove('linkH');
   document.getElementById(c).classList.remove('rootH');
   document.getElementById(c).getElementsByClassName('label')[0].innerHTML = document.getElementById(c).getAttribute('data-relation');
  });
 }
 concepts.forEach(function(c) {
  document.getElementById(c).style.opacity = 0.1;
 });
 _conceptRelationsConcepts(c).forEach(function(c) {
  if (concepts.indexOf(c) != -1) {
   document.getElementById(c).style.opacity = 1;
   document.getElementById(c).classList.add('linkH');
   var relation = '';
   _conceptRelations(c).forEach(function(r) {
    if (_relationConcepts(r).indexOf(root) != -1) {
     relation = _relationLabel(r);
    }
   });
   document.getElementById(c).getElementsByClassName('label')[0].innerHTML = relation;
  }
 });
 concept.classList.add('rootH');
 concept.getElementsByClassName('label')[0].innerHTML = '/'
}

function conceptRelationsConceptsVisualization(c) {
 visualizationsStack("conceptRelationsConceptsVisualization('" + c + "')");
 var concepts = _conceptRelationsConcepts(c);
 context = concepts;
 layout(concepts);
 normalize();
 itemSetActive('conceptFeedback', 'relationsFeedback', 'conceptsFeedback');
 var y = document.getElementById(document.getElementById(c).parentNode.getAttribute('id')).getBoundingClientRect().y;
 window.scrollBy(0, y - 100);
}

function cubeVisualization() {
 visualizationsStack("cubeVisualization()");
 context = [];
 layout(_concepts());
 normalize();
 itemSetActive('conceptsFeedback', 'cubeFeedback');
}

function defaultVisualization() {
 previousStack = [];
 nextStack = [];
 current = "";
 levelConceptsVisualization(_levels()[0]);
}

function entityConceptsVisualization(e) {
 visualizationsStack("entityConceptsVisualization('" + e + "')");
 context = [];
 layout(_entityConcepts(e));
 normalize();
 itemSetActive('conceptsFeedback', 'entityFeedback');
}

function granuleConceptsVisualization(g) {
 visualizationsStack("granuleConceptsVisualization('" + g + "')");
 context = [];
 layout(_granuleConcepts(g));
 normalize();
 itemSetActive('conceptsFeedback', 'granulesFeedback');
}

function levelConceptsVisualization(l) {
 visualizationsStack("levelConceptsVisualization('" + l + "')");
 context = [];
 layout(_levelConcepts(l));
 normalize();
 itemSetActive('conceptsFeedback', 'levelsFeedback');
}

function previousVisualization() {
 nextStack.push(current);
 var visualization = previousStack.pop();
 current = visualization;
 var pV = new Function(current);
 pV();
}

function nextVisualization() {
 previousStack.push(current);
 var visualization = nextStack.pop();
 current = visualization;
 var nV = new Function(current);
 nV();
}

function visualizationsStack(v) {
 if (current != "" && v != current) {
  previousStack.push(current);
 }
 current = v
}

function defaultSort() {
 var visualization = new Function(current);
 visualization();
}

function entitiesSort() {
 var containers = [].slice.call(document.getElementsByClassName('container'));
 containers.forEach(function(c) {
  if (c.getElementsByClassName('scalability').length > 1) {
   var items = JSON.parse(c.getAttribute('data-items'));
   items.sort(function(a, b) {
    return _conceptEntities(a).length - _conceptEntities(b).length;
   });
   items.reverse();
   levelContainer(items, 1);
  } else {
   var iso = Isotope.data('#' + c.getAttribute('id'));
   iso.arrange({
    filter: iso.options.filter,
    sortBy: 'entities',
    sortAscending: false
   })
  }
 });
}

function granulesSort() {
 var containers = [].slice.call(document.getElementsByClassName('container'));
 containers.forEach(function(c) {
  if (c.getElementsByClassName('scalability').length > 1) {
   var items = JSON.parse(c.getAttribute('data-items'));
   items.sort(function(a, b) {
    var x = _conceptGranules(a);
    var y = _conceptGranules(b);
    return x < y ? -1 : x > y ? 1 : 0;
   });
   levelContainer(items, 1);
  } else {
   var iso = Isotope.data('#' + c.getAttribute('id'));
   iso.arrange({
    filter: iso.options.filter,
    sortBy: 'granules',
    sortAscending: false
   })
  }
 });
}

function identifierSort() {
 var containers = [].slice.call(document.getElementsByClassName('container'));
 containers.forEach(function(c) {
  if (c.getElementsByClassName('scalability').length > 1) {
   var items = JSON.parse(c.getAttribute('data-items'));
   items.sort(function(a, b) {
    var x = _conceptIdentifier(a).toLowerCase();
    var y = _conceptIdentifier(b).toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
   });
   levelContainer(items, 1);
  } else {
   var iso = Isotope.data('#' + c.getAttribute('id'));
   iso.arrange({
    filter: iso.options.filter,
    sortBy: 'identifier',
    sortAscending: true
   })
  }
 });
}

function puzzleSort() {
 var containers = [].slice.call(document.getElementsByClassName('container'));
 containers.forEach(function(c) {
  if (c.getElementsByClassName('scalability').length > 1) {
   var items = JSON.parse(c.getAttribute('data-items'));
   items.sort(function(a, b) {
    return _conceptGranulesGranulesConcepts(a).length - _conceptGranulesGranulesConcepts(b).length
   });
   items.reverse();
   levelContainer(items, 1);
  } else {
   var iso = Isotope.data('#' + c.getAttribute('id'));
   iso.arrange({
    filter: iso.options.filter,
    sortBy: 'puzzle',
    sortAscending: false
   })
  }
 });
}

function relationsSort() {
 var containers = [].slice.call(document.getElementsByClassName('container'));
 containers.forEach(function(c) {
  if (c.getElementsByClassName('scalability').length > 1) {
   var items = JSON.parse(c.getAttribute('data-items'));
   items.sort(function(a, b) {
    return _conceptRelations(a).length - _conceptRelations(b).length;
   });
   items.reverse();
   levelContainer(items, 1);
  } else {
   var iso = Isotope.data('#' + c.getAttribute('id'));
   iso.arrange({
    filter: iso.options.filter,
    sortBy: 'relations',
    sortAscending: false
   })
  }
 });
}

function shuffleSort() {
 var containers = [].slice.call(document.getElementsByClassName('container'));
 containers.forEach(function(c) {
  if (c.getElementsByClassName('scalability').length > 1) {
   var items = JSON.parse(c.getAttribute('data-items'));
   items = items.sort(function() {
    return 0.5 - Math.random()
   });
   levelContainer(items, 1);
  } else {
   var iso = Isotope.data('#' + c.getAttribute('id'));
   iso.shuffle();
  }
 });
}

function layout(items) {
 var levelsHTML = "";
 _levels().sort().forEach(function(l) {
  levelsHTML += '<div title="Visualize the concepts in level ' + l + ' " id="level' + l + '" class="barItem interactive" style="border-top: 5px solid white; height: ' + 100 / (_concepts().length / _levelConcepts(l).length) + '%;" onclick="levelConceptsVisualization(\'' + l + '\')">' + l + '</div>';
 });
 document.getElementById("vertical").innerHTML = levelsHTML;
 var temp = {};
 items.forEach(function(i) {
  (temp[_conceptLevel(i)] = temp[_conceptLevel(i)] || []).push(i);
 });
 document.getElementById('containers').innerHTML = "";
 Object.keys(temp).forEach(function(k) {
  levelContainer(temp[k], 1);
  itemSetActive('level' + k);
  if (_levelConcepts(k).length != temp[k].length) {
   document.getElementById('level' + k).classList.add('dottedBackground');
  }
 });
}

function levelContainer(items, scalability) {
 var container,
  containerScalability,
  cid = 'levelContainer' + _conceptLevel(items[0]);
 if (document.getElementById(cid)) {
  container = document.getElementById(cid);
  containerScalability = container.getElementsByClassName('containerScalability')[0];
  [].slice.call(container.getElementsByClassName('item')).forEach(function(e) {
   Isotope.data('#' + cid).remove(e);
   Isotope.data('#' + cid).layout();
  });
 } else {
  container = document.createElement('div');
  containerScalability = document.createElement('div');
  container.setAttribute('class', 'container');
  containerScalability.setAttribute('class', 'containerScalability');
  container.appendChild(containerScalability);
  container.setAttribute('id', cid);
  document.getElementById('containers').appendChild(container);
  container = document.getElementById(cid);
  var iso = new Isotope(container, {
   itemSelector: '.item',
   layoutMode: 'fitRows',
   getSortData: {
    "identifier": function(itemElem) {
     if (itemElem.getAttribute('data-identifier')) return itemElem.getAttribute('data-identifier').toLowerCase()
    },
    "relations": '[data-relations] parseInt',
    "entities": '[data-entities] parseInt',
    "granules": '[data-granules]',
    "puzzle": '[data-puzzle] parseInt'
   }
  });
 }
 container.setAttribute('data-items', JSON.stringify(items));
 var scalabilityHTML = "";
 for (var i = 0; i < items.length / itemsScalabilityNumber; i++) {
  var h = 100 / Math.ceil(items.length / itemsScalabilityNumber);
  scalabilityHTML += '<div title="New items" class="interactive scalability" onclick="levelContainer(JSON.parse(this.parentNode.parentNode.getAttribute(\'data-items\')), ' + (i + 1) + ')" style="border-bottom: 5px solid white; height:' + h + '%;">' + (i + 1) + '</div>';
 }
 containerScalability.innerHTML = scalabilityHTML;
 items = items.slice((scalability - 1) * itemsScalabilityNumber, scalability * itemsScalabilityNumber)
 itemSetActive(container.getElementsByClassName('scalability')[(scalability - 1)]);
 items.forEach(function(c) {
  var concept = document.createElement('div');
  var granules = _conceptGranules(c).sort();
  var relation = '';
  if (context.length != 0) {
   if (context.indexOf(c) != -1) {
    if (c === context[0]) {
     concept.classList.add('root');
     relation = '/'
    } else {
     concept.classList.add('link');
     _conceptRelations(c).forEach(function(r) {
      if (_relationConcepts(r).indexOf(context[0]) != -1) {
       relation = _relationLabel(r);
      }
     });
    }
   }
  }
  concept.classList.add('conceptItem', 'left', 'item');
  concept.setAttribute('id', c);
  concept.setAttribute('data-granules', granules.toString());
  concept.setAttribute('data-identifier', _conceptIdentifier(c));
  concept.setAttribute('data-entities', _conceptEntities(c).length);
  concept.setAttribute('data-relation', relation);
  concept.setAttribute('data-relations', _conceptRelations(c).length);
  concept.setAttribute('data-puzzle', _conceptGranulesGranulesConcepts(c).length);
  var granulesHTML = ""
  granules.forEach(function(g) {
   var visible = true;
   _granuleConcepts(g).forEach(function(c) {
    if (container.getAttribute('data-items').indexOf(c) === -1) {
     visible = false;
    }
   });
   if (visible) {
    granulesHTML += '<div class="granule left interactive" style="width: ' + 100 / granules.length + '%; background-color:' + _granuleColor(g) + '" title="Visualize the concepts in this granule" onclick="granuleConceptsVisualization(\'' + g + '\')"></div>';
   } else {
    granulesHTML += '<div class="granule left interactive dottedBackground" style="width: ' + 100 / granules.length + '%; background-color:' + _granuleColor(g) + '" onclick="granuleConceptsVisualization(\'' + g + '\')" title="Visualize the concepts in this granule"></div>';
   }
  });
  granulesHTML += '<div class="clear"></div>';
  var conceptHTML = '<div class="label">' + relation + '</div><div class="puzzle interactive left" title="Visualize a subset of the puzzle" onclick="conceptGranulesGranulesConceptsVisualization(\'' + c + '\')"><i class="fa fa-puzzle-piece"></i></div><div class="entities interactive left" title="Visualize the entities with this concept" onclick="conceptEntitiesVisualization(\'' + c + '\')"><i class="fa fa-bars"></i></div><div class="relations interactive left" onclick="conceptRelationsConceptsVisualization(\'' + c + '\')" onmouseover="conceptRelationsConceptsHighlight(\'' + c + '\')"><i class="fa fa-link"></i></div><div class="clear"></div><div class="identifier">' + _conceptIdentifier(c) + '</div><div class="granules">' + granulesHTML + '</div>';
  concept.style.backgroundColor = _granuleColor(granules[0]);
  concept.innerHTML = conceptHTML;
  container.appendChild(concept);
  Isotope.data('#' + cid).appended(concept);
 });
}

function normalize() {
 if (previousStack.length != 0) {
  document.getElementById("previous").classList.toggle('interactive', true);
 } else {
  document.getElementById("previous").classList.toggle('interactive', false);
 }
 if (nextStack.length != 0) {
  document.getElementById("next").classList.toggle('interactive', true);
 } else {
  document.getElementById("next").classList.toggle('interactive', false);
 }
 [].slice.call(document.getElementById('feedback').getElementsByClassName('barItem')).forEach(function(i) {
  i.classList.remove('active');
 });
 [].slice.call(document.getElementById('sort').getElementsByClassName('barItem')).forEach(function(i) {
  i.classList.add('interactive');
 });
 itemSetActive(document.getElementById('navigation').getElementsByClassName('barItem')[1]);
 itemSetActive(document.getElementById('sort').getElementsByClassName('barItem')[0]);
}

function itemSetActive() {
 var args = Array.prototype.slice.call(arguments);
 if (typeof args[0] === 'object') {
  if (args[0].parentNode) {
   [].slice.call(args[0].parentNode.getElementsByClassName('active')).forEach(function(ae) {
    ae.classList.toggle('active', false);
   });
  }
  args[0].classList.toggle('active', true);
 } else {
  args.forEach(function(a) {
   document.getElementById(a).classList.add('active');
  });
 }
}