/**
 *  Object to hold a triple, used in graph.
 *  @class Triple
 *  @module com.eduworks.ec
 *  @author fritz.ray@eduworks.com
 */
var Triple = function() {};
Triple = stjs.extend(Triple, null, [], function(constructor, prototype) {
    /**
     *  Source vertex.
     *  @property source
     *  @type any
     */
    prototype.source = null;
    /**
     *  Destination vertex.
     *  @property destination
     *  @type any
     */
    prototype.destination = null;
    /**
     *  Object to hold in the edge.
     *  @property edge
     *  @type any
     */
    prototype.edge = null;
    /**
     *  Returns true IFF sources, destinations, and edges match.
     *  @method equals
     *  @param {Edge} obj
     *  @return {boolean} true IFF <see method definition>
     */
    prototype.equals = function(obj) {
        if (Object.prototype.equals.call(this, obj)) 
            return true;
        if (stjs.isInstanceOf(obj.constructor, Triple)) {
            var t = obj;
            if (this.source.equals(t.source) && this.destination.equals(t.destination) && this.edge.equals(t.edge)) 
                return true;
        }
        return false;
    };
}, {}, {});
/**
 *  Object Helper Functions
 *  @class EcObject
 *  @module com.eduworks.ec
 *  @author fritz.ray@eduworks.com
 */
var EcObject = function() {};
EcObject = stjs.extend(EcObject, null, [], function(constructor, prototype) {
    /**
     *  Returns true if the result is an object.
     *  @static
     *  @method isArray
     *  @param {any} o Object to test.
     *  @return true iff the object is an object.
     */
    constructor.isObject = function(o) {
        return (typeof o) == "object";
    };
    /**
     *  Returns keys on the object
     *  @static
     *  @method keys
     *  @param {any} o Object to test.
     *  @return List of keys
     */
    constructor.keys = function(o) {
        return ecKeys(o);
    };
}, {}, {});
var Callback5 = function() {};
Callback5 = stjs.extend(Callback5, null, [], function(constructor, prototype) {
    prototype.$invoke = function(p1, p2, p3, p4, p5) {};
}, {}, {});
/**
 *  Array Helper Functions
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EcArray
 *  @module com.eduworks.ec
 */
var EcArray = function() {};
EcArray = stjs.extend(EcArray, null, [], function(constructor, prototype) {
    /**
     *  Returns true if the result is an array.
     * 
     *  @param {any} o Object to test.
     *  @return true iff the object is an array.
     *  @static
     *  @method isArray
     */
    constructor.isArray = function(o) {
        return toString.call(o) == "[object Array]";
    };
    /**
     *  Removes values IFF the values == one another.
     * 
     *  @param a {Array} Array to remove duplicates from.
     *  @static
     *  @method removeDuplicates
     */
    constructor.removeDuplicates = function(a) {
        for (var i = 0; i < a.length; i++) 
            for (var j = i; j < a.length; j++) {
                if (j == i) 
                    continue;
                if (a[i] == a[j]) 
                    a.splice(j, 1);
            }
    };
    /**
     *  Adds a value if the array does not have the value already.
     * 
     *  @param a {Array} Array to add to.
     *  @param o {Object} Object to add to the array if it isn't in there already.
     *  @static
     *  @method setAdd
     */
    constructor.setAdd = function(a, o) {
        var inThere = false;
        for (var i = 0; i < a.length; i++) 
            if (a[i] == o) {
                inThere = true;
                break;
            }
        if (!inThere) 
            a.push(o);
    };
    /**
     *  Removes a value from the array.
     * 
     *  @param a {Array} Array to add to.
     *  @param o {Object} Object to add to the array if it isn't in there already.
     *  @static
     *  @method setAdd
     */
    constructor.setRemove = function(a, o) {
        for (var i = 0; i < a.length; i++) 
             while (a[i] == o){
                a.splice(i, 1);
            }
    };
    /**
     *  Returns true if the array has the value already.
     * 
     *  @param a {Array} Array.
     *  @param o {Object} Object to sample for.
     *  @static
     *  @method has
     */
    constructor.has = function(a, o) {
        var inThere = false;
        for (var i = 0; i < a.length; i++) 
            if (a[i] == o) {
                return true;
            }
        return false;
    };
}, {}, {});
var EcLocalStorage = function() {};
EcLocalStorage = stjs.extend(EcLocalStorage, null, [], function(constructor, prototype) {
    constructor.removeItem = function(s, key) {
        ((s)["removeItem"])(key);
    };
}, {}, {});
/**
 *  Created by fray on 7/5/17.
 */
var Task = function() {};
Task = stjs.extend(Task, null, [], function(constructor, prototype) {
    constructor.desiredFps = 10;
    constructor.lastFrame = null;
    constructor.tasks = null;
    constructor.delayedFunctions = 0;
    constructor.immediateFunctions = 0;
    constructor.immediate = function(c) {
        var currentMs = Date.now();
        var nextFrameMs = stjs.trunc(1000 / Task.desiredFps);
        if (Task.lastFrame == null || currentMs > Task.lastFrame + nextFrameMs) 
            return setTimeout(function() {
                Task.delayedFunctions++;
                Task.lastFrame = Date.now();
                c();
            }, 0);
         else {
            Task.immediateFunctions++;
            c();
        }
        return null;
    };
}, {tasks: {name: "Array", arguments: ["CallbackOrFunction"]}}, {});
/**
 *  A hypergraph, consisting of a set of vertices of type <code>V</code> and a
 *  set of hyperedges of type <code>E</code> which connect the vertices. This is
 *  the base interface for all JUNG graph types.
 *  <P>
 *  This interface permits, but does not enforce, any of the following common
 *  variations of graphs:
 *  <ul>
 *  <li/>hyperedges (edges which connect a set of vertices of any size)
 *  <li/>edges (these have have exactly two endpoints, which may or may not be
 *  distinct)
 *  <li/>self-loops (edges which connect exactly one vertex)
 *  <li>directed and undirected edges
 *  <li>vertices and edges with attributes (for example, weighted edges)
 *  <li>vertices and edges with different constraints or properties (for example,
 *  bipartite or multimodal graphs)
 *  <li>parallel edges (multiple edges which connect a single set of vertices)
 *  <li>internal representations as matrices or as adjacency lists or adjacency
 *  maps
 *  </ul>
 *  Extensions or implementations of this interface may enforce or disallow any
 *  or all of these variations.
 *  <p>
 *  <b>Notes</b>:
 *  <ul>
 *  <li/>The collections returned by <code>Hypergraph</code> instances should be
 *  treated in general as if read-only. While they are not contractually
 *  guaranteed (or required) to be immutable, this interface does not define the
 *  outcome if they are mutated. Mutations should be done via
 *  <code>{add,remove}{Edge,Vertex}</code>, or in the constructor.
 *  <li/>
 *  </ul>
 *  
 *  @class Hypergraph
 *  @module com.eduworks.ec
 *  @author Joshua O'Madadhain
 *   
 *  Ported to Javascript by:
 *  @author Fritz Ray (Eduworks)
 *  @author Tom Buskirk (Eduworks)
 */
var Hypergraph = function() {};
Hypergraph = stjs.extend(Hypergraph, null, [], function(constructor, prototype) {
    /**
     *  Returns a view of all edges in this graph. In general, this obeys the
     *  <code>Array</code> contract, and therefore makes no guarantees about the
     *  ordering of the vertices within the set.
     *  
     *  @method getEdges
     *  @return a <code>Array</code> view of all edges in this graph
     */
    prototype.getEdges = function() {};
    /**
     *  Returns a view of all vertices in this graph. In general, this obeys the
     *  <code>Array</code> contract, and therefore makes no guarantees about the
     *  ordering of the vertices within the set.
     *  
     *  @method getVerticies
     *  @return a <code>Array</code> view of all vertices in this graph
     */
    prototype.getVertices = function() {};
    /**
     *  Returns true if this graph's vertex collection contains
     *  <code>vertex</code>. Equivalent to
     *  <code>getVertices().contains(vertex)</code>.
     *  
     *  @method containsVertex
     *  @param vertex
     *             the vertex whose presence is being queried
     *  @return true iff this graph contains a vertex <code>vertex</code>
     */
    prototype.containsVertex = function(vertex) {};
    /**
     *  Returns true if this graph's edge collection contains <code>edge</code>.
     *  Equivalent to <code>getEdges().contains(edge)</code>.
     *  
     *  @method containsEdge
     *  @param edge
     *             the edge whose presence is being queried
     *  @return true iff this graph contains an edge <code>edge</code>
     */
    prototype.containsEdge = function(edge) {};
    /**
     *  Returns the number of edges in this graph.
     *  
     *  @method getEdgeCount
     *  @return the number of edges in this graph
     */
    prototype.getEdgeCount = function() {};
    /**
     *  Returns the number of vertices in this graph.
     *  
     *  @method getVertexCount
     *  @return the number of vertices in this graph
     */
    prototype.getVertexCount = function() {};
    /**
     *  Returns the collection of vertices which are connected to
     *  <code>vertex</code> via any edges in this graph. If <code>vertex</code>
     *  is connected to itself with a self-loop, then it will be included in the
     *  collection returned.
     *  
     *  @method getNeighbors
     *  @param vertex
     *             the vertex whose neighbors are to be returned
     *  @return the collection of vertices which are connected to
     *          <code>vertex</code>, or <code>null</code> if <code>vertex</code>
     *          is not present
     */
    prototype.getNeighbors = function(vertex) {};
    /**
     *  Returns the collection of edges in this graph which are connected to
     *  <code>vertex</code>.
     *  
     *  @method getIncidentEdges
     *  @param vertex
     *             the vertex whose incident edges are to be returned
     *  @return the collection of edges which are connected to
     *          <code>vertex</code>, or <code>null</code> if <code>vertex</code>
     *          is not present
     */
    prototype.getIncidentEdges = function(vertex) {};
    /**
     *  Returns the collection of vertices in this graph which are connected to
     *  <code>edge</code>. Note that for some graph types there are guarantees
     *  about the size of this collection (i.e., some graphs contain edges that
     *  have exactly two endpoints, which may or may not be distinct).
     *  Implementations for those graph types may provide alternate methods that
     *  provide more convenient access to the vertices.
     *  
     *  @method getIncidentVertices
     *  @param edge
     *             the edge whose incident vertices are to be returned
     *  @return the collection of vertices which are connected to
     *          <code>edge</code>, or <code>null</code> if <code>edge</code> is
     *          not present
     */
    prototype.getIncidentVertices = function(edge) {};
    /**
     *  Returns an edge that connects this vertex to <code>v</code>. If this edge
     *  is not uniquely defined (that is, if the graph contains more than one
     *  edge connecting <code>v1</code> to <code>v2</code>), any of these edges
     *  may be returned. <code>findEdgeSet(v1, v2)</code> may be used to return
     *  all such edges. Returns null if either of the following is true:
     *  <ul>
     *  <li/><code>v2</code> is not connected to <code>v1</code>
     *  <li/>either <code>v1</code> or <code>v2</code> are not present in this
     *  graph
     *  </ul>
     *  <p>
     *  <b>Note</b>: for purposes of this method, <code>v1</code> is only
     *  considered to be connected to <code>v2</code> via a given <i>directed</i>
     *  edge <code>e</code> if
     *  <code>v1 == e.getSource() && v2 == e.getDest()</code> evaluates to
     *  <code>true</code>. (<code>v1</code> and <code>v2</code> are connected by
     *  an undirected edge <code>u</code> if <code>u</code> is incident to both
     *  <code>v1</code> and <code>v2</code>.)
     *  
     *  @method findEdge
     *  @param v1 between this
     *  @param v2 and that
     *  @return an edge that connects <code>v1</code> to <code>v2</code>, or
     *          <code>null</code> if no such edge exists (or either vertex is not
     *          present)
     *  @see Hypergraph#findEdgeSet(Object, Object)
     */
    prototype.findEdge = function(v1, v2) {};
    /**
     *  Returns all edges that connects this vertex to <code>v</code>. If this
     *  edge is not uniquely defined (that is, if the graph contains more than
     *  one edge connecting <code>v1</code> to <code>v2</code>), any of these
     *  edges may be returned. <code>findEdgeSet(v1, v2)</code> may be used to
     *  return all such edges. Returns null if <code>v2</code> is not connected
     *  to <code>v1</code>. <br/>
     *  Returns an empty collection if either <code>v1</code> or <code>v2</code>
     *  are not present in this graph.
     *  
     *  <p>
     *  <b>Note</b>: for purposes of this method, <code>v1</code> is only
     *  considered to be connected to <code>v2</code> via a given <i>directed</i>
     *  edge <code>d</code> if
     *  <code>v1 == d.getSource() && v2 == d.getDest()</code> evaluates to
     *  <code>true</code>. (<code>v1</code> and <code>v2</code> are connected by
     *  an undirected edge <code>u</code> if <code>u</code> is incident to both
     *  <code>v1</code> and <code>v2</code>.)
     *  
     *  @method findEdgeSet
     *  @param v1 between this
     *  @param v2 and that
     *  @return a collection containing all edges that connect <code>v1</code> to
     *          <code>v2</code>, or <code>null</code> if either vertex is not
     *          present
     *  @see Hypergraph#findEdge(Object, Object)
     */
    prototype.findEdgeSet = function(v1, v2) {};
    /**
     *  Adds <code>vertex</code> to this graph. Fails if <code>vertex</code> is
     *  null or already in the graph.
     *  
     *  @method addVertex
     *  @param vertex
     *             the vertex to add
     *  @return <code>true</code> if the add is successful, and
     *          <code>false</code> otherwise
     *  @throws IllegalArgumentException
     *              if <code>vertex</code> is <code>null</code>
     */
    prototype.addVertex = function(vertex) {};
    /**
     *  Adds <code>edge</code> to this graph. Fails under the following
     *  circumstances:
     *  <ul>
     *  <li/><code>edge</code> is already an element of the graph
     *  <li/>either <code>edge</code> or <code>vertices</code> is
     *  <code>null</code>
     *  <li/><code>vertices</code> has the wrong number of vertices for the graph
     *  type
     *  <li/><code>vertices</code> are already connected by another edge in this
     *  graph, and this graph does not accept parallel edges
     *  </ul>
     *  
     *  @method addHyperEdge
     *  @param edge
     *  @param vertices
     *  @return <code>true</code> if the add is successful, and
     *          <code>false</code> otherwise
     *  @throws IllegalArgumentException
     *              if <code>edge</code> or <code>vertices</code> is null, or if
     *              a different vertex set in this graph is already connected by
     *              <code>edge</code>, or if <code>vertices</code> are not a
     *              legal vertex set for <code>edge</code>
     */
    prototype.addHyperEdge = function(edge, vertices) {};
    /**
     *  Removes <code>vertex</code> from this graph. As a side effect, removes
     *  any edges <code>e</code> incident to <code>vertex</code> if the removal
     *  of <code>vertex</code> would cause <code>e</code> to be incident to an
     *  illegal number of vertices. (Thus, for example, incident hyperedges are
     *  not removed, but incident edges--which must be connected to a vertex at
     *  both endpoints--are removed.)
     *  
     *  <p>
     *  Fails under the following circumstances:
     *  <ul>
     *  <li/><code>vertex</code> is not an element of this graph
     *  <li/><code>vertex</code> is <code>null</code>
     *  </ul>
     *  
     *  @method removeVertex
     *  @param vertex
     *             the vertex to remove
     *  @return <code>true</code> if the removal is successful,
     *          <code>false</code> otherwise
     */
    prototype.removeVertex = function(vertex) {};
    /**
     *  Removes <code>edge</code> from this graph. Fails if <code>edge</code> is
     *  null, or is otherwise not an element of this graph.
     *  
     *  @method removeEdge
     *  @param edge
     *             the edge to remove
     *  @return <code>true</code> if the removal is successful,
     *          <code>false</code> otherwise
     */
    prototype.removeEdge = function(edge) {};
    /**
     *  Returns <code>true</code> if <code>v1</code> and <code>v2</code> share an
     *  incident edge. Equivalent to <code>getNeighbors(v1).contains(v2)</code>.
     *  
     *  @method isNeighbor
     *  @param v1
     *             the first vertex to test
     *  @param v2
     *             the second vertex to test
     *  @return <code>true</code> if <code>v1</code> and <code>v2</code> share an
     *          incident edge
     */
    prototype.isNeighbor = function(v1, v2) {};
    /**
     *  Returns <code>true</code> if <code>vertex</code> and <code>edge</code>
     *  are incident to each other. Equivalent to
     *  <code>getIncidentEdges(vertex).contains(edge)</code> and to
     *  <code>getIncidentVertices(edge).contains(vertex)</code>.
     *  
     *  @method isIncident
     *  @param vertex
     *  @param edge
     *  @return <code>true</code> if <code>vertex</code> and <code>edge</code>
     *          are incident to each other
     */
    prototype.isIncident = function(vertex, edge) {};
    /**
     *  Returns the number of edges incident to <code>vertex</code>. Special
     *  cases of interest:
     *  <ul>
     *  <li/>Incident self-loops are counted once.
     *  <li>If there is only one edge that connects this vertex to each of its
     *  neighbors (and vice versa), then the value returned will also be equal to
     *  the number of neighbors that this vertex has (that is, the output of
     *  <code>getNeighborCount</code>).
     *  <li>If the graph is directed, then the value returned will be the sum of
     *  this vertex's indegree (the number of edges whose destination is this
     *  vertex) and its outdegree (the number of edges whose source is this
     *  vertex), minus the number of incident self-loops (to avoid
     *  double-counting).
     *  </ul>
     *  <p>
     *  Equivalent to <code>getIncidentEdges(vertex).size()</code>.
     *  
     *  @method degree
     *  @param vertex
     *             the vertex whose degree is to be returned
     *  @return the degree of this node
     *  @see Hypergraph#getNeighborCount(Object)
     */
    prototype.degree = function(vertex) {};
    /**
     *  Returns the number of vertices that are adjacent to <code>vertex</code>
     *  (that is, the number of vertices that are incident to edges in
     *  <code>vertex</code>'s incident edge set).
     *  
     *  <p>
     *  Equivalent to <code>getNeighbors(vertex).size()</code>.
     *  
     *  @method getNeighborCount
     *  @param vertex
     *             the vertex whose neighbor count is to be returned
     *  @return the number of neighboring vertices
     */
    prototype.getNeighborCount = function(vertex) {};
    /**
     *  Returns the number of vertices that are incident to <code>edge</code>.
     *  For hyperedges, this can be any nonnegative integer; for edges this must
     *  be 2 (or 1 if self-loops are permitted).
     *  
     *  <p>
     *  Equivalent to <code>getIncidentVertices(edge).size()</code>.
     *  
     *  @method getIncidentCount
     *  @param edge
     *             the edge whose incident vertex count is to be returned
     *  @return the number of vertices that are incident to <code>edge</code>.
     */
    prototype.getIncidentCount = function(edge) {};
    /**
     *  Returns the edge type of <code>edge</code> in this graph.
     *  
     *  @method getEdgeType
     *  @param edge
     *  @return the <code>EdgeType</code> of <code>edge</code>, or
     *          <code>null</code> if <code>edge</code> has no defined type
     */
    prototype.getEdgeType = function(edge) {};
    /**
     *  Returns the default edge type for this graph.
     *  
     *  @method getDefaultEdgeType
     *  @return the default edge type for this graph
     */
    prototype.getDefaultEdgeType = function() {};
    /**
     *  Returns the collection of edges in this graph which are of type
     *  <code>edge_type</code>.
     *  
     *  @method getEdgesOfType
     *  @param edge_type
     *             the type of edges to be returned
     *  @return the collection of edges which are of type <code>edge_type</code>,
     *          or <code>null</code> if the graph does not accept edges of this
     *          type
     *  @see EdgeType
     */
    prototype.getEdgesOfType = function(edge_type) {};
    /**
     *  Returns the number of edges of type <code>edge_type</code> in this graph.
     *  
     *  @method getEdgeCountOfType
     *  @param edge_type
     *             the type of edge for which the count is to be returned
     *  @return the number of edges of type <code>edge_type</code> in this graph
     */
    prototype.getEdgeCountOfType = function(edge_type) {};
    /**
     *  Returns a <code>Array</code> view of the incoming edges incident to
     *  <code>vertex</code> in this graph.
     *  
     *  @method getInEdges
     *  @param vertex
     *             the vertex whose incoming edges are to be returned
     *  @return a <code>Array</code> view of the incoming edges incident to
     *          <code>vertex</code> in this graph
     */
    prototype.getInEdges = function(vertex) {};
    /**
     *  Returns a <code>Array</code> view of the outgoing edges incident to
     *  <code>vertex</code> in this graph.
     *  
     *  @method getOutEdges
     *  @param vertex
     *             the vertex whose outgoing edges are to be returned
     *  @return a <code>Array</code> view of the outgoing edges incident to
     *          <code>vertex</code> in this graph
     */
    prototype.getOutEdges = function(vertex) {};
    /**
     *  Returns the number of incoming edges incident to <code>vertex</code>.
     *  Equivalent to <code>getInEdges(vertex).size()</code>.
     *  
     *  @method inDegree
     *  @param vertex
     *             the vertex whose indegree is to be calculated
     *  @return the number of incoming edges incident to <code>vertex</code>
     */
    prototype.inDegree = function(vertex) {};
    /**
     *  Returns the number of outgoing edges incident to <code>vertex</code>.
     *  Equivalent to <code>getOutEdges(vertex).size()</code>.
     *  
     *  @method outDegree
     *  @param vertex
     *             the vertex whose outdegree is to be calculated
     *  @return the number of outgoing edges incident to <code>vertex</code>
     */
    prototype.outDegree = function(vertex) {};
    /**
     *  If <code>directed_edge</code> is a directed edge in this graph, returns
     *  the source; otherwise returns <code>null</code>. The source of a directed
     *  edge <code>d</code> is defined to be the vertex for which <code>d</code>
     *  is an outgoing edge. <code>directed_edge</code> is guaranteed to be a
     *  directed edge if its <code>EdgeType</code> is <code>DIRECTED</code>.
     *  
     *  @method getSource
     *  @param directed_edge
     *  @return the source of <code>directed_edge</code> if it is a directed edge
     *          in this graph, or <code>null</code> otherwise
     */
    prototype.getSource = function(directed_edge) {};
    /**
     *  If <code>directed_edge</code> is a directed edge in this graph, returns
     *  the destination; otherwise returns <code>null</code>. The destination of
     *  a directed edge <code>d</code> is defined to be the vertex incident to
     *  <code>d</code> for which <code>d</code> is an incoming edge.
     *  <code>directed_edge</code> is guaranteed to be a directed edge if its
     *  <code>EdgeType</code> is <code>DIRECTED</code>.
     *  
     *  @method getDest
     *  @param directed_edge
     *  @return the destination of <code>directed_edge</code> if it is a directed
     *          edge in this graph, or <code>null</code> otherwise
     */
    prototype.getDest = function(directed_edge) {};
    /**
     *  Returns a <code>Array</code> view of the predecessors of
     *  <code>vertex</code> in this graph. A predecessor of <code>vertex</code>
     *  is defined as a vertex <code>v</code> which is connected to
     *  <code>vertex</code> by an edge <code>e</code>, where <code>e</code> is an
     *  outgoing edge of <code>v</code> and an incoming edge of
     *  <code>vertex</code>.
     *  
     *  @method getPredecessors
     *  @param vertex
     *             the vertex whose predecessors are to be returned
     *  @return a <code>Array</code> view of the predecessors of
     *          <code>vertex</code> in this graph
     */
    prototype.getPredecessors = function(vertex) {};
    /**
     *  Returns a <code>Array</code> view of the successors of
     *  <code>vertex</code> in this graph. A successor of <code>vertex</code> is
     *  defined as a vertex <code>v</code> which is connected to
     *  <code>vertex</code> by an edge <code>e</code>, where <code>e</code> is an
     *  incoming edge of <code>v</code> and an outgoing edge of
     *  <code>vertex</code>.
     *  
     *  @method getSuccessors
     *  @param vertex
     *             the vertex whose predecessors are to be returned
     *  @return a <code>Array</code> view of the successors of
     *          <code>vertex</code> in this graph
     */
    prototype.getSuccessors = function(vertex) {};
}, {}, {});
var EcDate = function() {};
EcDate = stjs.extend(EcDate, null, [], function(constructor, prototype) {
    constructor.toISOString = function(obj) {
        return ((obj)["toISOString"])();
    };
}, {}, {});
/**
 *  Wrapper to handle all remote web service invocations.
 * 
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 *  @class EcRemote
 *  @module com.eduworks.ec
 */
var EcRemote = function() {};
EcRemote = stjs.extend(EcRemote, null, [], function(constructor, prototype) {
    /**
     *  Turn this property off to cause all remote web service calls to be
     *  synchronous. Can be useful for test scripts, blocking calls, etc.
     * 
     *  @property async
     *  @static
     *  @type boolean
     */
    constructor.async = true;
    /**
     *  Timeout for AJAX requests
     * 
     *  @property async
     *  @static
     *  @type boolean
     */
    constructor.timeout = 60 * 1000 * 5;
    /**
     *  POSTs a request to a remote endpoint. Composed of a server endpoint (root
     *  URL) and a service (service path). Sends form data as a multi-part mime
     *  request.
     * 
     *  @param {string}           server Protocol, hostname and path to the remote handler.
     *  @param {string}           service Path to service to invoke.
     *  @param {FormData}         fd Form data to send as multi-part mime.
     *  @param {function(object)} success Method that is invoked if the server
     *                            responds with a success (per jQuery ajax)
     *  @param {function(string)} failure Method that is invoked if the server
     *                            responds with an error (per jQuery ajax) or a non-200/300.
     *  @method postExpectingObject
     *  @static
     */
    constructor.postExpectingObject = function(server, service, fd, success, failure) {
        EcRemote.postInner(server, service, fd, EcRemote.getSuccessJSONCallback(success, failure), EcRemote.getFailureCallback(failure));
    };
    /**
     *  POSTs a request to a remote endpoint. Composed of a server endpoint (root
     *  URL) and a service (service path). Sends form data as a multi-part mime
     *  request.
     * 
     *  @param {string}           server Protocol, hostname and path to the remote handler.
     *  @param {string}           service Path to service to invoke.
     *  @param {FormData}         fd Form data to send as multi-part mime.
     *  @param {function(string)} success Method that is invoked if the server
     *                            responds with a success (per jQuery ajax)
     *  @param {function(string)} failure Method that is invoked if the server
     *                            responds with an error (per jQuery ajax) or a non-200/300.
     *  @method postExpectingString
     *  @static
     */
    constructor.postExpectingString = function(server, service, fd, success, failure) {
        EcRemote.postInner(server, service, fd, EcRemote.getSuccessCallback(success, failure), EcRemote.getFailureCallback(failure));
    };
    constructor.postInner = function(server, service, fd, successCallback, failureCallback) {
        var url = server;
        if (!url.endsWith("/") && service != null && !"".equals(service)) {
            url += "/";
        }
        if (service != null) {
            url += service;
        }
        var p = {};
        p.method = "POST";
        p.url = url;
        if ((fd)["_streams"] != null) {
            var chunks = (fd)["_streams"];
            var all = "";
            for (var i = 0; i < chunks.length; i++) {
                if ((typeof chunks[i]) == "function") {
                    all = all + "\r\n";
                } else {
                    all = all + chunks[i];
                }
            }
            all = all + "\r\n\r\n--" + (fd)["_boundary"] + "--";
            p.headers = new Object();
            p.headers["Content-Type"] = "multipart/form-data; boundary=" + (fd)["_boundary"];
            p.data = all;
        } else {
            p.mimeType = "multipart/form-data";
            p.data = fd;
        }
        (p)["contentType"] = false;
        p.cache = false;
        p.async = EcRemote.async;
        p.timeout = EcRemote.timeout;
        p.processData = false;
        p.success = successCallback;
        p.error = failureCallback;
        EcRemote.upgradeHttpToHttps(p);
        if ($ == null) {
            var o = new Object();
            (o)["status"] = 200;
            (o)["responseText"] = JSON.stringify(httpPost(p.data, p.url, "multipart/form-data; boundary=" + (fd)["_boundary"], "false", (fd)["_boundary"]));
            successCallback(null, null, o);
        } else {
            $.ajax(p);
        }
    };
    /**
     *  GETs something from a remote endpoint. Composed of a server endpoint
     *  (root URL) and a service (service path).
     * 
     *  @param {string}           server Protocol, hostname and path to the remote handler.
     *  @param {string}           service Path to service to invoke.
     *  @param {function(object)} success Method that is invoked if the server
     *                            responds with a success (per jQuery ajax)
     *  @param {function(string)} failure Method that is invoked if the server
     *                            responds with an error (per jQuery ajax) or a non-200/300.
     *  @method getExpectingObject
     *  @static
     */
    constructor.getExpectingObject = function(server, service, success, failure) {
        var url = server;
        if (!url.endsWith("/") && service != null && service.equals("")) {
            url += "/";
        }
        if (service != null) {
            url += service;
        }
        var p = {};
        p.method = "GET";
        p.url = url;
        p.cache = false;
        p.async = EcRemote.async;
        p.timeout = EcRemote.timeout;
        p.processData = false;
        p.dataType = "json";
        p.success = EcRemote.getSuccessJSONCallback(success, failure);
        p.error = EcRemote.getFailureCallback(failure);
        EcRemote.upgradeHttpToHttps(p);
        if ($ == null) {
            success(httpGet(p.url));
        } else {
            $.ajax(p);
        }
    };
    /**
     *  GETs something from a remote endpoint. Composed of a server endpoint
     *  (root URL) and a service (service path).
     * 
     *  @param {string}           server Protocol, hostname and path to the remote handler.
     *  @param {string}           service Path to service to invoke.
     *  @param {function(object)} success Method that is invoked if the server
     *                            responds with a success (per jQuery ajax)
     *  @param {function(string)} failure Method that is invoked if the server
     *                            responds with an error (per jQuery ajax) or a non-200/300.
     *  @method getExpectingString
     *  @static
     */
    constructor.getExpectingString = function(server, service, success, failure) {
        var url = server;
        if (!url.endsWith("/") && service != null && service.equals("")) {
            url += "/";
        }
        if (service != null) {
            url += service;
        }
        var p = {};
        p.method = "GET";
        p.url = url;
        p.async = EcRemote.async;
        p.timeout = EcRemote.timeout;
        p.processData = false;
        p.success = EcRemote.getSuccessCallback(success, failure);
        p.error = EcRemote.getFailureCallback(failure);
        EcRemote.upgradeHttpToHttps(p);
        if ($ == null) {
            success(httpGet(p.url));
        } else {
            $.ajax(p);
        }
    };
    /**
     *  DELETEs something at a remote endpoint. Composed of a server endpoint
     *  (root URL) and a service (service path).
     * 
     *  @param {string}           server Protocol, hostname and path to the remote handler.
     *  @param {string}           service Path to service to invoke.
     *  @param {function(object)} success Method that is invoked if the server
     *                            responds with a success (per jQuery ajax)
     *  @param {function(string)} failure Method that is invoked if the server
     *                            responds with an error (per jQuery ajax) or a non-200/300.
     *  @method _delete
     *  @static
     */
    constructor._delete = function(url, signatureSheet, success, failure) {
        var p = {};
        p.method = "DELETE";
        p.url = url;
        p.async = EcRemote.async;
        p.timeout = EcRemote.timeout;
        p.headers = new Object();
        p.headers["signatureSheet"] = signatureSheet;
        p.success = EcRemote.getSuccessCallback(success, failure);
        p.error = EcRemote.getFailureCallback(failure);
        EcRemote.upgradeHttpToHttps(p);
        if ($ == null) {
            success(httpDelete(p.url));
        } else {
            $.ajax(p);
        }
    };
    constructor.upgradeHttpToHttps = function(p) {
        if (window != null) {
            if (window.location != null) {
                if (p.url.indexOf(window.location.protocol) == -1) {
                    if (window.location.protocol.startsWith("https")) {
                        if (!p.url.startsWith("https:")) {
                            p.url = p.url.replace("http:", "https:");
                        }
                    }
                }
            }
        }
    };
    constructor.handleFailure = function(failure, paramP1, paramP2, paramP3) {
        if (failure != null) {
            if (paramP1 != null) {
                if (paramP1.responseText != null) {
                    failure(paramP1.responseText);
                } else if (paramP1.statusText != null) {
                    failure(paramP1.statusText.toString());
                } else {
                    failure("General error in AJAX request.");
                }
            } else if (paramP2 != null) {
                failure(paramP2);
            } else if (paramP3 != null) {
                failure(paramP3);
            } else {
                failure("General error in AJAX request.");
            }
        }
    };
    constructor.getSuccessCallback = function(success, failure) {
        return function(arg0, arg1, arg2) {
            if (arg2.status > 300 || arg2.status < 200) {
                if (failure != null) 
                    failure("Error with code: " + arg2.status);
            } else if (success != null) {
                success(arg2.responseText);
            }
        };
    };
    constructor.getSuccessJSONCallback = function(success, failure) {
        return function(arg0, arg1, arg2) {
            if (arg2.status > 300 || arg2.status < 200) {
                if (failure != null) 
                    failure("Error with code: " + arg2.status);
            } else if (success != null) {
                try {
                    if (EcObject.isObject(arg2.responseText)) 
                        success(arg2.responseText);
                     else if (EcArray.isArray(arg2.responseText)) 
                        success(arg2.responseText);
                     else 
                        success(JSON.parse(arg2.responseText));
                }catch (ex) {
                    if (ex != null) {
                        if (failure != null) 
                            if ((ex)["getMessage"] != null) {
                                failure(ex.getMessage());
                            } else {
                                failure(ex);
                            }
                    }
                }
            }
        };
    };
    constructor.getFailureCallback = function(failure) {
        return function(paramP1, paramP2, paramP3) {
            EcRemote.handleFailure(failure, paramP1, paramP2, paramP3);
        };
    };
}, {}, {});
/**
 *  Pattern (probably similar to Promise) that provides fine grained control over asynchronous execution.
 *  Will iterate over all items in an array and perform 'each(item,callback)'. 
 *  Every 'each' needs to call the callback. This callback can be passed down through several asynchronous calls. 
 *  When all callbacks have been called, 'after(array)' is called. 
 *  @author fritz.ray@eduworks.com
 *  @module com.eduworks.ec
 *  @class EcAsyncHelper
 */
var EcAsyncHelper = function() {};
EcAsyncHelper = stjs.extend(EcAsyncHelper, null, [], function(constructor, prototype) {
    constructor.scriptPath = null;
    /**
     *  Counter that counts down when each callback is called. Lots of tricks can be done to cause after to proc in different ways.
     *  @property counter
     *  @type integer
     */
    prototype.counter = null;
    /**
     *  "Each" method. See class description.
     *  @method each
     *  @param {Array} array Array to iterate over.
     *  @param {function(item,callback)} each Method that gets invoked per item in the array.
     *  @param {function(array)} after Method invoked when all callbacks are called.
     */
    prototype.each = function(array, each, after) {
        var me = this;
        this.counter = array.length;
        if (array.length == 0) 
            after(array);
        for (var i = 0; i < array.length; i++) {
            if (this.counter > 0) 
                this.execute(array, each, after, me, i);
        }
    };
    prototype.execute = function(array, each, after, me, i) {
        Task.immediate(function() {
            each(array[i], function() {
                me.counter--;
                if (me.counter == 0) 
                    after(array);
            });
        });
    };
    /**
     *  Will prevent 'after' from being called.
     *  @method stop
     */
    prototype.stop = function() {
        this.counter = -1;
    };
}, {}, {});
/**
 *  A graph consisting of a set of vertices of type <code>V</code>
 *  set and a set of edges of type <code>E</code>.  Edges of this
 *  graph type have exactly two endpoints; whether these endpoints 
 *  must be distinct depends on the implementation.
 *  <P>
 *  This interface permits, but does not enforce, any of the following 
 *  common variations of graphs:
 *  <ul>
 *  <li> directed and undirected edges
 *  <li> vertices and edges with attributes (for example, weighted edges)
 *  <li> vertices and edges of different types (for example, bipartite 
 *       or multimodal graphs)
 *  <li> parallel edges (multiple edges which connect a single set of vertices)
 *  <li> representations as matrices or as adjacency lists or adjacency maps
 *  </ul> 
 *  Extensions or implementations of this interface 
 *  may enforce or disallow any or all of these variations.
 *  
 *  <p>Definitions (with respect to a given vertex <code>v</code>):
 *  <ul>
 *  <li/><b>incoming edge</b> of <code>v</code>: an edge that can be traversed 
 *  from a neighbor of <code>v</code> to reach <code>v</code>
 *  <li/><b>outgoing edge</b> of <code>v</code>: an edge that can be traversed
 *  from <code>v</code> to reach some neighbor of <code>v</code> 
 *  <li/><b>predecessor</b> of <code>v</code>: a vertex at the other end of an
 *  incoming edge of <code>v</code>
 *  <li/><b>successor</b> of <code>v</code>: a vertex at the other end of an 
 *  outgoing edge of <code>v</code>
 *  <li/>
 *  </ul> 
 *  
 *  @class Graph
 *  @module com.eduworks.ec
 *  @extends Hypergraph
 *  @author Joshua O'Madadhain
 *  
 *  Ported to Javascript by:
 *  @author Fritz Ray (Eduworks)
 *  @author Tom Buskirk (Eduworks)
 */
var Graph = function() {};
Graph = stjs.extend(Graph, null, [Hypergraph], function(constructor, prototype) {
    /**
     *  Returns a <code>Collection</code> view of the incoming edges incident to <code>vertex</code>
     *  in this graph.
     *  @method getInEdges
     *  @param vertex    the vertex whose incoming edges are to be returned
     *  @return  a <code>Collection</code> view of the incoming edges incident 
     *  to <code>vertex</code> in this graph
     */
    prototype.getInEdges = function(vertex) {};
    /**
     *  Returns a <code>Collection</code> view of the outgoing edges incident to <code>vertex</code>
     *  in this graph.
     *  @method getOutEdges
     *  @param vertex    the vertex whose outgoing edges are to be returned
     *  @return  a <code>Collection</code> view of the outgoing edges incident 
     *  to <code>vertex</code> in this graph
     */
    prototype.getOutEdges = function(vertex) {};
    /**
     *  Returns a <code>Collection</code> view of the predecessors of <code>vertex</code> 
     *  in this graph.  A predecessor of <code>vertex</code> is defined as a vertex <code>v</code> 
     *  which is connected to 
     *  <code>vertex</code> by an edge <code>e</code>, where <code>e</code> is an outgoing edge of 
     *  <code>v</code> and an incoming edge of <code>vertex</code>.
     *  @method getPredecessors
     *  @param vertex    the vertex whose predecessors are to be returned
     *  @return  a <code>Collection</code> view of the predecessors of 
     *  <code>vertex</code> in this graph
     */
    prototype.getPredecessors = function(vertex) {};
    /**
     *  Returns a <code>Collection</code> view of the successors of <code>vertex</code> 
     *  in this graph.  A successor of <code>vertex</code> is defined as a vertex <code>v</code> 
     *  which is connected to 
     *  <code>vertex</code> by an edge <code>e</code>, where <code>e</code> is an incoming edge of 
     *  <code>v</code> and an outgoing edge of <code>vertex</code>.
     *  @method getSuccessors
     *  @param vertex    the vertex whose predecessors are to be returned
     *  @return  a <code>Collection</code> view of the successors of 
     *  <code>vertex</code> in this graph
     */
    prototype.getSuccessors = function(vertex) {};
    /**
     *  Returns the number of incoming edges incident to <code>vertex</code>.
     *  Equivalent to <code>getInEdges(vertex).size()</code>.
     *  @method inDegree
     *  @param vertex    the vertex whose indegree is to be calculated
     *  @return  the number of incoming edges incident to <code>vertex</code>
     */
    prototype.inDegree = function(vertex) {};
    /**
     *  Returns the number of outgoing edges incident to <code>vertex</code>.
     *  Equivalent to <code>getOutEdges(vertex).size()</code>.
     *  @method outDegree
     *  @param vertex    the vertex whose outdegree is to be calculated
     *  @return  the number of outgoing edges incident to <code>vertex</code>
     */
    prototype.outDegree = function(vertex) {};
    /**
     *  Returns <code>true</code> if <code>v1</code> is a predecessor of <code>v2</code> in this graph.
     *  Equivalent to <code>v1.getPredecessors().contains(v2)</code>.
     *  @method isPredecessor
     *  @param v1 the first vertex to be queried
     *  @param v2 the second vertex to be queried
     *  @return <code>true</code> if <code>v1</code> is a predecessor of <code>v2</code>, and false otherwise.
     */
    prototype.isPredecessor = function(v1, v2) {};
    /**
     *  Returns <code>true</code> if <code>v1</code> is a successor of <code>v2</code> in this graph.
     *  Equivalent to <code>v1.getSuccessors().contains(v2)</code>.
     *  @method isSuccessor
     *  @param v1 the first vertex to be queried
     *  @param v2 the second vertex to be queried
     *  @return <code>true</code> if <code>v1</code> is a successor of <code>v2</code>, and false otherwise.
     */
    prototype.isSuccessor = function(v1, v2) {};
    /**
     *  Returns the number of predecessors that <code>vertex</code> has in this graph.
     *  Equivalent to <code>vertex.getPredecessors().size()</code>.
     *  @method getPredecessorCount
     *  @param vertex the vertex whose predecessor count is to be returned
     *  @return  the number of predecessors that <code>vertex</code> has in this graph
     */
    prototype.getPredecessorCount = function(vertex) {};
    /**
     *  Returns the number of successors that <code>vertex</code> has in this graph.
     *  Equivalent to <code>vertex.getSuccessors().size()</code>.
     *  @method getSuccessorCount
     *  @param vertex the vertex whose successor count is to be returned
     *  @return  the number of successors that <code>vertex</code> has in this graph
     */
    prototype.getSuccessorCount = function(vertex) {};
    /**
     *  If <code>directed_edge</code> is a directed edge in this graph, returns the source; 
     *  otherwise returns <code>null</code>. 
     *  The source of a directed edge <code>d</code> is defined to be the vertex for which  
     *  <code>d</code> is an outgoing edge.
     *  <code>directed_edge</code> is guaranteed to be a directed edge if 
     *  its <code>EdgeType</code> is <code>DIRECTED</code>. 
     *  @method getSource
     *  @param directed_edge
     *  @return  the source of <code>directed_edge</code> if it is a directed edge in this graph, or <code>null</code> otherwise
     */
    prototype.getSource = function(directed_edge) {};
    /**
     *  If <code>directed_edge</code> is a directed edge in this graph, returns the destination; 
     *  otherwise returns <code>null</code>. 
     *  The destination of a directed edge <code>d</code> is defined to be the vertex 
     *  incident to <code>d</code> for which  
     *  <code>d</code> is an incoming edge.
     *  <code>directed_edge</code> is guaranteed to be a directed edge if 
     *  its <code>EdgeType</code> is <code>DIRECTED</code>. 
     *  @method getDest
     *  @param directed_edge
     *  @return  the destination of <code>directed_edge</code> if it is a directed edge in this graph, or <code>null</code> otherwise
     */
    prototype.getDest = function(directed_edge) {};
    /**
     *  Returns <code>true</code> if <code>vertex</code> is the source of <code>edge</code>.
     *  Equivalent to <code>getSource(edge).equals(vertex)</code>.
     *  @method isSource
     *  @param vertex the vertex to be queried
     *  @param edge the edge to be queried
     *  @return <code>true</code> iff <code>vertex</code> is the source of <code>edge</code>
     */
    prototype.isSource = function(vertex, edge) {};
    /**
     *  Returns <code>true</code> if <code>vertex</code> is the destination of <code>edge</code>.
     *  Equivalent to <code>getDest(edge).equals(vertex)</code>.
     *  @param vertex the vertex to be queried
     *  @param edge the edge to be queried
     *  @return <code>true</code> iff <code>vertex</code> is the destination of <code>edge</code>
     */
    prototype.isDest = function(vertex, edge) {};
    /**
     *  Adds edge <code>e</code> to this graph such that it connects 
     *  vertex <code>v1</code> to <code>v2</code>.
     *  Equivalent to <code>addEdge(e, new Pair<V>(v1, v2))</code>.
     *  If this graph does not contain <code>v1</code>, <code>v2</code>, 
     *  or both, implementations may choose to either silently add 
     *  the vertices to the graph or throw an <code>IllegalArgumentException</code>.
     *  If this graph assigns edge types to its edges, the edge type of
     *  <code>e</code> will be the default for this graph.
     *  See <code>Hypergraph.addEdge()</code> for a listing of possible reasons
     *  for failure.
     *  @method addEdge
     *  @param e the edge to be added
     *  @param v1 the first vertex to be connected
     *  @param v2 the second vertex to be connected
     *  @return <code>true</code> if the add is successful, <code>false</code> otherwise
     *  @see Hypergraph#addEdge(Object, Collection)
     *  @see #addEdge(Object, Object, Object, EdgeType)
     */
    prototype.addEdge = function(e, v1, v2) {};
    /**
     *  Returns the vertex at the other end of <code>edge</code> from <code>vertex</code>.
     *  (That is, returns the vertex incident to <code>edge</code> which is not <code>vertex</code>.)
     *  @method getOpposite
     *  @param vertex the vertex to be queried
     *  @param edge the edge to be queried
     *  @return the vertex at the other end of <code>edge</code> from <code>vertex</code>
     */
    prototype.getOpposite = function(vertex, edge) {};
}, {}, {});
/**
 *  A directed implementation of {{#crossLink "Graph"}}Graph{{/crossLink}}. Edges have types. Two vertices may have many edges between them.
 *  @class EcDirectedGraph
 *  @module com.eduworks.ec
 *  @extends Graph
 *  @author fray
 * 
 *  @param <V>
 *  @param <E>
 */
var EcDirectedGraph = function() {};
EcDirectedGraph = stjs.extend(EcDirectedGraph, null, [Graph], function(constructor, prototype) {
    prototype.edges = null;
    prototype.verticies = null;
    prototype.getEdges = function() {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) 
            results[i] = this.edges[i].edge;
        return results;
    };
    prototype.getVertices = function() {
        var results = new Array();
        for (var i = 0; i < this.verticies.length; i++) 
            results[i] = this.verticies[i];
        return results;
    };
    prototype.containsVertex = function(vertex) {
        for (var i = 0; i < this.verticies.length; i++) 
            if (vertex.equals(this.verticies[i])) 
                return true;
        return false;
    };
    prototype.containsEdge = function(edge) {
        for (var i = 0; i < this.edges.length; i++) 
            if (edge.equals(this.edges[i].edge)) 
                return true;
        return false;
    };
    prototype.getEdgeCount = function() {
        return this.edges.length;
    };
    prototype.getVertexCount = function() {
        return this.verticies.length;
    };
    prototype.getNeighbors = function(vertex) {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) {
            if (vertex.equals(this.edges[i].source)) 
                results.push(this.edges[i].destination);
             else if (vertex.equals(this.edges[i].destination)) 
                results.push(this.edges[i].source);
        }
        EcArray.removeDuplicates(results);
        return results;
    };
    prototype.getIncidentEdges = function(vertex) {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) {
            if (vertex.equals(this.edges[i].source)) 
                results.push(this.edges[i].edge);
             else if (vertex.equals(this.edges[i].destination)) 
                results.push(this.edges[i].edge);
        }
        EcArray.removeDuplicates(results);
        return results;
    };
    prototype.getIncidentVertices = function(edge) {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) {
            if (edge.equals(this.edges[i].edge)) {
                results.push(this.edges[i].source);
                results.push(this.edges[i].destination);
            }
        }
        EcArray.removeDuplicates(results);
        return results;
    };
    prototype.findEdge = function(v1, v2) {
        for (var i = 0; i < this.edges.length; i++) {
            if (v1.equals(this.edges[i].source) && v2.equals(this.edges[i].destination)) 
                return this.edges[i].edge;
            if (v1.equals(this.edges[i].destination) && v2.equals(this.edges[i].source)) 
                return this.edges[i].edge;
        }
        return null;
    };
    prototype.findEdgeSet = function(v1, v2) {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) {
            if (v1.equals(this.edges[i].source) && v2.equals(this.edges[i].destination)) 
                results.push(this.edges[i].edge);
            if (v1.equals(this.edges[i].destination) && v2.equals(this.edges[i].source)) 
                results.push(this.edges[i].edge);
        }
        return results;
    };
    prototype.addVertex = function(vertex) {
        if (this.verticies.indexOf(vertex) != -1) 
            return false;
        this.verticies.push(vertex);
        return true;
    };
    prototype.removeVertex = function(vertex) {
        var indexOf = this.verticies.indexOf(vertex);
        if (indexOf != -1) {
            for (var i = 0; i < this.edges.length; i++) {
                if (this.edges[i].source.equals(vertex) || this.edges[i].destination.equals(vertex)) {
                    this.edges.splice(i, 1);
                    i--;
                }
            }
            this.verticies.splice(indexOf, 1);
            return true;
        }
        return false;
    };
    prototype.removeEdge = function(edge) {
        var success = false;
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].edge.equals(edge)) {
                this.edges.splice(i, 1);
                i--;
                success = true;
            }
        }
        return success;
    };
    prototype.isNeighbor = function(v1, v2) {
        for (var i = 0; i < this.edges.length; i++) {
            if (v1.equals(this.edges[i].source) && v2.equals(this.edges[i].destination)) 
                return true;
             else if (v1.equals(this.edges[i].destination) && v2.equals(this.edges[i].source)) 
                return true;
        }
        return false;
    };
    prototype.isIncident = function(vertex, edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if ((vertex.equals(this.edges[i].source) || vertex.equals(this.edges[i].destination)) && edge.equals(this.edges[i].edge)) 
                return true;
        }
        return false;
    };
    prototype.degree = function(vertex) {
        var count = 0;
        for (var i = 0; i < this.edges.length; i++) {
            if (vertex.equals(this.edges[i].source) || vertex.equals(this.edges[i].destination)) 
                count++;
        }
        return count;
    };
    prototype.getNeighborCount = function(vertex) {
        return this.getNeighbors(vertex).length;
    };
    prototype.getIncidentCount = function(edge) {
        return this.getIncidentVertices(edge).length;
    };
    prototype.getEdgeType = function(edge) {};
    prototype.getDefaultEdgeType = function() {};
    prototype.getEdgesOfType = function(edge_type) {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) {
            if (this.getEdgeType(this.edges[i].edge) == edge_type) 
                results.push(this.edges[i].edge);
        }
        return results;
    };
    prototype.getEdgeCountOfType = function(edge_type) {
        return this.getEdgesOfType(edge_type).length;
    };
    prototype.getInEdges = function(vertex) {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) {
            if (vertex.equals(this.edges[i].destination)) 
                results.push(this.edges[i].edge);
        }
        EcArray.removeDuplicates(results);
        return results;
    };
    prototype.getOutEdges = function(vertex) {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) {
            if (vertex.equals(this.edges[i].source)) 
                results.push(this.edges[i].edge);
        }
        EcArray.removeDuplicates(results);
        return results;
    };
    prototype.inDegree = function(vertex) {
        return this.getInEdges(vertex).length;
    };
    prototype.outDegree = function(vertex) {
        return this.getOutEdges(vertex).length;
    };
    prototype.getSource = function(directed_edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if (directed_edge.equals(this.edges[i].edge)) 
                return this.edges[i].source;
        }
        return null;
    };
    prototype.getDest = function(directed_edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if (directed_edge.equals(this.edges[i].edge)) 
                return this.edges[i].destination;
        }
        return null;
    };
    prototype.getPredecessors = function(vertex) {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) {
            if (vertex.equals(this.edges[i].destination)) 
                results.push(this.edges[i].source);
        }
        EcArray.removeDuplicates(results);
        return results;
    };
    prototype.getSuccessors = function(vertex) {
        var results = new Array();
        for (var i = 0; i < this.edges.length; i++) {
            if (vertex.equals(this.edges[i].source)) 
                results.push(this.edges[i].destination);
        }
        EcArray.removeDuplicates(results);
        return results;
    };
    prototype.isPredecessor = function(v1, v2) {
        for (var i = 0; i < this.edges.length; i++) {
            if (v1.equals(this.edges[i].destination)) 
                if (v2.equals(this.edges[i].source)) 
                    return true;
        }
        return false;
    };
    prototype.isSuccessor = function(v1, v2) {
        for (var i = 0; i < this.edges.length; i++) {
            if (v2.equals(this.edges[i].destination)) 
                if (v1.equals(this.edges[i].source)) 
                    return true;
        }
        return false;
    };
    prototype.getPredecessorCount = function(vertex) {
        return this.getPredecessors(vertex).length;
    };
    prototype.getSuccessorCount = function(vertex) {
        return this.getSuccessors(vertex).length;
    };
    prototype.isSource = function(vertex, edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if (edge.equals(this.edges[i].edge)) 
                if (vertex.equals(this.edges[i].source)) 
                    return true;
        }
        return false;
    };
    prototype.isDest = function(vertex, edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if (edge.equals(this.edges[i].edge)) 
                if (vertex.equals(this.edges[i].destination)) 
                    return true;
        }
        return false;
    };
    prototype.addEdge = function(e, v1, v2) {
        this.addVertex(v1);
        this.addVertex(v2);
        var t = new Triple();
        t.source = v1;
        t.destination = v2;
        t.edge = e;
        if (this.edges.indexOf(t) != -1) 
            return false;
        this.edges.push(t);
        return true;
    };
    prototype.getOpposite = function(vertex, edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if (edge.equals(this.edges[i].edge)) 
                if (vertex.equals(this.edges[i].destination)) 
                    return this.edges[i].source;
                 else if (vertex.equals(this.edges[i].source)) 
                    return this.edges[i].destination;
        }
        return null;
    };
}, {edges: {name: "Array", arguments: [{name: "Triple", arguments: ["V", "V", "E"]}]}, verticies: {name: "Array", arguments: ["V"]}}, {});