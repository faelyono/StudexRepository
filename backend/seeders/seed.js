require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize, Course, Lesson, Topic, Flashcard, User } = require('../models');
const bcrypt = require('bcryptjs');

const SEED_DATA = [
  {
    title: 'Linear Algebra',
    description: 'Master vectors, matrices, eigenvalues and linear transformations — the mathematical backbone of computer graphics, ML, and signal processing.',
    lessons: [
      {
        title: 'Vectors & Spaces', order: 1,
        topics: [
          {
            title: 'Vector Basics', order: 1,
            cards: [
              { q: 'What is a vector?', a: 'An ordered list of numbers (components) representing magnitude and direction in n-dimensional space. Written as v = [v₁, v₂, ..., vₙ].' },
              { q: 'What is the dot product of vectors u and v?', a: 'u · v = Σ(uᵢ × vᵢ) = |u||v|cos(θ)\nResult is a scalar. If u · v = 0, the vectors are perpendicular (orthogonal).' },
              { q: 'What is a unit vector?', a: 'A vector with magnitude (norm) = 1.\nCalculate: û = v / |v|  where |v| = √(v₁² + v₂² + ... + vₙ²)' },
              { q: 'What is the cross product used for?', a: 'The cross product u × v produces a vector perpendicular to both u and v.\n|u × v| = |u||v|sin(θ)\nOnly defined in 3D space.' },
            ]
          },
          {
            title: 'Vector Spaces', order: 2,
            cards: [
              { q: 'What is a vector space?', a: 'A set V of vectors with two operations (addition and scalar multiplication) satisfying 8 axioms including closure, associativity, commutativity, identity elements, and distributivity.' },
              { q: 'What is a basis of a vector space?', a: 'A set of linearly independent vectors that spans the entire space.\nEvery vector in the space can be expressed as a unique linear combination of basis vectors.' },
              { q: 'What is the dimension of a vector space?', a: 'The number of vectors in any basis of the space.\nℝⁿ has dimension n. The dimension is unique — all bases have the same number of vectors.' },
            ]
          },
        ]
      },
      {
        title: 'Matrices', order: 2,
        topics: [
          {
            title: 'Matrix Operations', order: 1,
            cards: [
              { q: 'How is matrix multiplication defined?', a: 'For A (m×n) and B (n×p), C = AB where Cᵢⱼ = Σₖ Aᵢₖ Bₖⱼ\nRow × Column inner products. Result is m×p.\nNote: AB ≠ BA in general (not commutative).' },
              { q: 'What is the transpose of a matrix?', a: 'Aᵀ is formed by swapping rows and columns: (Aᵀ)ᵢⱼ = Aⱼᵢ\nProperties: (AB)ᵀ = BᵀAᵀ, (Aᵀ)ᵀ = A' },
              { q: 'What is an identity matrix?', a: 'A square matrix I with 1s on the diagonal and 0s elsewhere.\nProperty: AI = IA = A for any compatible matrix A.' },
              { q: 'What is the inverse of a matrix?', a: 'A⁻¹ exists if A is square and det(A) ≠ 0.\nAA⁻¹ = A⁻¹A = I\nFor 2×2: if A = [[a,b],[c,d]], then A⁻¹ = (1/det) × [[d,-b],[-c,a]]' },
            ]
          },
          {
            title: 'Determinants', order: 2,
            cards: [
              { q: 'What does the determinant represent geometrically?', a: 'The scaling factor of areas/volumes under the linear transformation represented by the matrix.\ndet = 0 → matrix is singular (non-invertible, collapses space).' },
              { q: 'How do you calculate a 2×2 determinant?', a: 'For A = [[a,b],[c,d]]:\ndet(A) = ad - bc\nThis equals the signed area of the parallelogram formed by the row vectors.' },
            ]
          },
        ]
      },
      {
        title: 'Eigenvalues & Eigenvectors', order: 3,
        topics: [
          {
            title: 'Eigenvalue Problem', order: 1,
            cards: [
              { q: 'What is an eigenvector?', a: 'A non-zero vector v such that Av = λv for some scalar λ (eigenvalue).\nThe transformation only stretches/shrinks the vector, never changes its direction.' },
              { q: 'How do you find eigenvalues?', a: 'Solve the characteristic equation: det(A - λI) = 0\nThis gives a polynomial in λ. Each root is an eigenvalue.' },
              { q: 'What is diagonalization?', a: 'A = PDP⁻¹ where D is diagonal (eigenvalues on diagonal) and P contains eigenvectors as columns.\nUseful for computing Aⁿ efficiently.' },
            ]
          },
        ]
      },
    ]
  },
  {
    title: 'Calculus',
    description: 'From limits and derivatives to integrals and series — calculus is essential for algorithms, optimization, and understanding change in engineering systems.',
    lessons: [
      {
        title: 'Limits & Continuity', order: 1,
        topics: [
          {
            title: 'Limits', order: 1,
            cards: [
              { q: 'What is the definition of a limit?', a: 'lim(x→a) f(x) = L means f(x) can be made arbitrarily close to L by making x sufficiently close to a (but not equal to a).' },
              { q: "What is L'Hôpital's Rule?", a: 'If lim gives 0/0 or ∞/∞ form:\nlim(x→a) f(x)/g(x) = lim(x→a) f\'(x)/g\'(x)\nApply repeatedly if still indeterminate.' },
              { q: 'What does continuity mean?', a: 'f is continuous at x=a if:\n1. f(a) exists\n2. lim(x→a) f(x) exists\n3. lim(x→a) f(x) = f(a)\nIntuitively: no holes, jumps, or asymptotes.' },
            ]
          },
        ]
      },
      {
        title: 'Differentiation', order: 2,
        topics: [
          {
            title: 'Derivative Rules', order: 1,
            cards: [
              { q: 'State the Chain Rule.', a: 'If y = f(g(x)), then dy/dx = f\'(g(x)) × g\'(x)\nOr: d/dx[f(g(x))] = (df/dg)(dg/dx)\nExample: d/dx[sin(x²)] = cos(x²) × 2x' },
              { q: 'State the Product Rule.', a: 'd/dx[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)\nMnemonic: "first × d(second) + second × d(first)"' },
              { q: 'State the Quotient Rule.', a: 'd/dx[f/g] = (f\'g - fg\') / g²\nMnemonic: "lo d(hi) minus hi d(lo) over lo squared"' },
              { q: 'What is the derivative of eˣ and ln(x)?', a: 'd/dx[eˣ] = eˣ\nd/dx[ln(x)] = 1/x\nThese are inverses: derivative of eˣ is itself.' },
            ]
          },
          {
            title: 'Applications', order: 2,
            cards: [
              { q: 'What is the gradient in multivariable calculus?', a: '∇f = [∂f/∂x₁, ∂f/∂x₂, ..., ∂f/∂xₙ]\nPoints in the direction of steepest ascent.\nUsed in gradient descent for ML optimization.' },
              { q: 'How do you find local maxima/minima?', a: '1. Find critical points: f\'(x) = 0 or undefined\n2. Second derivative test: f\'\'(x) < 0 → max, f\'\'(x) > 0 → min, f\'\'(x) = 0 → inconclusive' },
            ]
          },
        ]
      },
      {
        title: 'Integration', order: 3,
        topics: [
          {
            title: 'Integration Techniques', order: 1,
            cards: [
              { q: 'State the Fundamental Theorem of Calculus.', a: 'Part 1: d/dx[∫ₐˣ f(t)dt] = f(x)\nPart 2: ∫ₐᵇ f(x)dx = F(b) - F(a) where F is any antiderivative of f.' },
              { q: 'What is integration by substitution?', a: 'Replace u = g(x), du = g\'(x)dx\n∫f(g(x))g\'(x)dx = ∫f(u)du\nReverse of the chain rule.' },
            ]
          },
        ]
      },
    ]
  },
  {
    title: 'Discrete Mathematics',
    description: 'Logic, sets, relations, graph theory, and combinatorics — the mathematical foundation for algorithm analysis, cryptography, and formal verification.',
    lessons: [
      {
        title: 'Logic & Proofs', order: 1,
        topics: [
          {
            title: 'Propositional Logic', order: 1,
            cards: [
              { q: 'What is a tautology?', a: 'A proposition that is always TRUE regardless of truth values of its components.\nExample: p ∨ ¬p (Law of Excluded Middle)\nOpposite of a contradiction (always FALSE).' },
              { q: 'State De Morgan\'s Laws.', a: '¬(p ∧ q) ≡ ¬p ∨ ¬q\n¬(p ∨ q) ≡ ¬p ∧ ¬q\nUseful for simplifying logical expressions and boolean algebra.' },
              { q: 'What is a contrapositive?', a: 'Contrapositive of "p → q" is "¬q → ¬p"\nA statement and its contrapositive are logically equivalent.\nOften easier to prove than the original implication.' },
              { q: 'What is proof by contradiction?', a: 'Assume the negation of what you want to prove.\nDerive a logical contradiction.\nConclusion: the original statement must be true.\nExample: proving √2 is irrational.' },
            ]
          },
        ]
      },
      {
        title: 'Graph Theory', order: 2,
        topics: [
          {
            title: 'Graph Fundamentals', order: 1,
            cards: [
              { q: 'What is a graph G = (V, E)?', a: 'V = set of vertices (nodes)\nE = set of edges (pairs of vertices)\nDirected graph: edges have direction\nWeighted graph: edges have weights/costs' },
              { q: 'What is the degree of a vertex?', a: 'Number of edges incident to the vertex.\nHandshaking Lemma: Σ deg(v) = 2|E|\nThe sum of all degrees = twice the number of edges.' },
              { q: 'What is a tree in graph theory?', a: 'A connected, acyclic graph with n vertices and n-1 edges.\nAny two vertices are connected by exactly one path.\nFoundation for search algorithms and data structures.' },
            ]
          },
        ]
      },
    ]
  },
  {
    title: 'Data Structures',
    description: 'Arrays, linked lists, trees, graphs, hash tables — master the containers that power every algorithm and system you\'ll ever build.',
    lessons: [
      {
        title: 'Linear Structures', order: 1,
        topics: [
          {
            title: 'Arrays & Linked Lists', order: 1,
            cards: [
              { q: 'What is the time complexity of array access vs linked list access?', a: 'Array: O(1) random access by index\nLinked List: O(n) — must traverse from head\nTrade-off: arrays waste space when resizing; linked lists have pointer overhead.' },
              { q: 'When would you use a doubly linked list over singly linked?', a: 'When you need O(1) deletion given a node reference, or need to traverse backwards.\nCost: extra prev pointer per node, slightly more memory.\nUsed in: LRU cache, browser history, text editors.' },
              { q: 'What is a stack and what are its operations?', a: 'LIFO (Last In, First Out) structure.\nOperations: push (add to top), pop (remove from top), peek/top (view top)\nAll O(1). Used for: function call stack, undo/redo, expression parsing.' },
              { q: 'What is a queue and how does it differ from a stack?', a: 'FIFO (First In, First Out) — first added is first removed.\nenqueue (add to rear), dequeue (remove from front).\nUsed for: BFS, task scheduling, print queues.' },
            ]
          },
        ]
      },
      {
        title: 'Trees', order: 2,
        topics: [
          {
            title: 'Binary Search Trees', order: 1,
            cards: [
              { q: 'What is the BST property?', a: 'For every node n:\n- All nodes in left subtree have values < n\n- All nodes in right subtree have values > n\nSearch, insert, delete: O(h) where h is tree height.' },
              { q: 'What is a balanced BST and why does it matter?', a: 'A BST where height h = O(log n).\nExamples: AVL tree, Red-Black tree.\nEnsures search/insert/delete stay O(log n) instead of degrading to O(n) for skewed trees.' },
              { q: 'What are the three tree traversal orders?', a: 'Inorder (Left, Root, Right) → sorted order for BST\nPreorder (Root, Left, Right) → copy/serialize tree\nPostorder (Left, Right, Root) → delete tree, evaluate expressions' },
            ]
          },
          {
            title: 'Heaps', order: 2,
            cards: [
              { q: 'What is a min-heap property?', a: 'Every parent node ≤ its children.\nRoot is always the minimum element.\nUsed for: priority queues, Dijkstra\'s algorithm, heap sort.\nInsert and extract-min: O(log n).' },
            ]
          },
        ]
      },
      {
        title: 'Hash Tables', order: 3,
        topics: [
          {
            title: 'Hashing Concepts', order: 1,
            cards: [
              { q: 'What is a hash function?', a: 'Maps keys to array indices (buckets).\nGood hash function: deterministic, uniform distribution, fast computation.\nAverage case O(1) for insert, search, delete.' },
              { q: 'What is a hash collision and how is it handled?', a: 'Collision: two keys hash to same index.\nSeparate Chaining: each bucket holds a linked list.\nOpen Addressing: probe for next empty slot (linear, quadratic, double hashing).' },
            ]
          },
        ]
      },
    ]
  },
  {
    title: 'Algorithms',
    description: 'Sorting, searching, dynamic programming, graph algorithms — learn to solve problems efficiently and analyze complexity.',
    lessons: [
      {
        title: 'Complexity Analysis', order: 1,
        topics: [
          {
            title: 'Big-O Notation', order: 1,
            cards: [
              { q: 'What does O(n log n) mean?', a: 'The algorithm\'s time grows as n multiplied by log₂(n).\nFaster than O(n²), slower than O(n).\nExamples: merge sort, heap sort, most efficient comparison-based sorts.' },
              { q: 'What is the difference between O, Ω, and Θ?', a: 'O (Big-O): upper bound — worst case\nΩ (Omega): lower bound — best case\nΘ (Theta): tight bound — both upper and lower\nExample: binary search is O(log n), Ω(1), Θ(log n) on average.' },
              { q: 'List the common time complexities from fastest to slowest.', a: 'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)\nConstant < Logarithmic < Linear < Linearithmic < Quadratic < Exponential < Factorial' },
            ]
          },
        ]
      },
      {
        title: 'Sorting', order: 2,
        topics: [
          {
            title: 'Sorting Algorithms', order: 1,
            cards: [
              { q: 'How does Merge Sort work?', a: 'Divide: split array in half recursively until single elements.\nConquer: merge sorted halves.\nTime: O(n log n) always. Space: O(n).\nStable sort. Best for linked lists.' },
              { q: 'How does Quick Sort work?', a: 'Choose pivot, partition array (smaller left, larger right).\nRecursively sort partitions.\nAverage: O(n log n), Worst: O(n²) with bad pivot.\nIn-place (O(log n) space). Fastest in practice.' },
              { q: 'What is Counting Sort and when is it used?', a: 'Non-comparison sort: count frequency of each value.\nTime: O(n + k) where k = range of values.\nOnly works for integers in a known range.\nBeats O(n log n) when k is small.' },
            ]
          },
        ]
      },
      {
        title: 'Dynamic Programming', order: 3,
        topics: [
          {
            title: 'DP Fundamentals', order: 1,
            cards: [
              { q: 'What are the two properties needed for Dynamic Programming?', a: '1. Optimal Substructure: optimal solution built from optimal sub-solutions.\n2. Overlapping Subproblems: same sub-problems solved multiple times (memoize!).\nWithout overlap → Divide & Conquer is sufficient.' },
              { q: 'What is the difference between top-down and bottom-up DP?', a: 'Top-down (Memoization): recursive + cache results.\nBottom-up (Tabulation): fill table iteratively from base cases.\nBoth achieve same complexity. Bottom-up avoids recursion overhead.' },
              { q: 'What is the Knapsack problem?', a: 'Given n items with weights w[i] and values v[i], and capacity W:\nMaximize total value without exceeding weight W.\n0/1 Knapsack: each item used at most once → O(nW) DP table.\nFundamental DP problem.' },
            ]
          },
        ]
      },
    ]
  },
  {
    title: 'Digital Logic',
    description: 'Boolean algebra, logic gates, combinational and sequential circuits — the hardware foundation every computer engineer must understand.',
    lessons: [
      {
        title: 'Boolean Algebra', order: 1,
        topics: [
          {
            title: 'Logic Gates', order: 1,
            cards: [
              { q: 'What are the three universal gates and why are they called universal?', a: 'NAND and NOR are each universal (can implement any logic function alone).\nNAND: ¬(A∧B), NOR: ¬(A∨B)\nAND, OR, NOT can each be built from only NAND gates (or only NOR gates).' },
              { q: 'What is a Karnaugh Map (K-Map) used for?', a: 'A visual method to simplify Boolean expressions by grouping adjacent 1s.\nGroups of 1, 2, 4, 8 cells correspond to terms with 0, 1, 2, 3 fewer variables.\nMinimizes gate count in circuit design.' },
              { q: 'State the Consensus Theorem.', a: 'AB + A\'C + BC = AB + A\'C\nThe term BC is redundant and can be eliminated.\nDual: (A+B)(A\'+C)(B+C) = (A+B)(A\'+C)' },
            ]
          },
        ]
      },
      {
        title: 'Sequential Circuits', order: 2,
        topics: [
          {
            title: 'Flip-Flops', order: 1,
            cards: [
              { q: 'What is the difference between D, JK, and SR flip-flops?', a: 'SR: Set/Reset — invalid when S=R=1\nD: Data/Delay — Q follows D on clock edge, no invalid state\nJK: J=K=1 toggles output — eliminates SR invalid state\nD-FF most common in modern digital design.' },
              { q: 'What is a finite state machine (FSM)?', a: 'A computational model with finite states, transitions triggered by inputs, and outputs.\nMealy: outputs depend on state AND input\nMoore: outputs depend only on state\nUsed for: controllers, parsers, protocol design.' },
            ]
          },
        ]
      },
    ]
  },
  {
    title: 'Computer Architecture',
    description: 'CPU design, instruction sets, memory hierarchy, pipelining — understand how hardware executes your code at the lowest level.',
    lessons: [
      {
        title: 'CPU Organization', order: 1,
        topics: [
          {
            title: 'Instruction Set Architecture', order: 1,
            cards: [
              { q: 'What is the difference between RISC and CISC?', a: 'RISC (Reduced Instruction Set): simple fixed-length instructions, load/store architecture, many registers. Examples: ARM, MIPS\nCISC (Complex Instruction Set): variable-length, complex instructions, fewer registers. Example: x86\nModern CPUs translate CISC to RISC-like micro-ops internally.' },
              { q: 'What are the 5 stages of the classic MIPS pipeline?', a: '1. IF — Instruction Fetch\n2. ID — Instruction Decode / Register Read\n3. EX — Execute (ALU)\n4. MEM — Memory Access\n5. WB — Write Back\nPipelining allows multiple instructions in-flight simultaneously.' },
              { q: 'What is a data hazard in pipelining?', a: 'Occurs when an instruction depends on the result of a previous instruction still in the pipeline.\nSolutions:\n- Stalling (inserting NOPs)\n- Data Forwarding/Bypassing (routing result directly)\n- Out-of-order execution' },
            ]
          },
        ]
      },
      {
        title: 'Memory Hierarchy', order: 2,
        topics: [
          {
            title: 'Cache Memory', order: 1,
            cards: [
              { q: 'Why is cache memory used?', a: 'Speed gap between CPU (ns) and DRAM (ms) requires fast intermediate storage.\nCache exploits: Temporal locality (recently used data) and Spatial locality (nearby data).\nTypical hit rate: 95%+, drastically reduces average memory access time.' },
              { q: 'What is the difference between direct-mapped, set-associative, and fully associative cache?', a: 'Direct-mapped: each block maps to exactly one cache line. Fast but many conflicts.\nFully associative: block can go anywhere. Flexible but expensive hardware.\nSet-associative (n-way): block maps to one set, can occupy any of n lines. Balance of both.' },
            ]
          },
        ]
      },
    ]
  },
  {
    title: 'Computational Thinking',
    description: 'Decomposition, pattern recognition, abstraction, and algorithm design — develop the systematic problem-solving mindset of a computer scientist.',
    lessons: [
      {
        title: 'Problem Decomposition', order: 1,
        topics: [
          {
            title: 'Core Concepts', order: 1,
            cards: [
              { q: 'What are the four pillars of Computational Thinking?', a: '1. Decomposition — break problem into smaller sub-problems\n2. Pattern Recognition — identify similarities and trends\n3. Abstraction — focus on essential details, ignore irrelevant ones\n4. Algorithm Design — create step-by-step solution' },
              { q: 'What is the difference between iteration and recursion?', a: 'Iteration: uses loops, explicit state management, O(1) space.\nRecursion: function calls itself, implicit stack, O(n) space for n-deep calls.\nAny iterative solution can be rewritten recursively and vice versa.' },
            ]
          },
        ]
      },
    ]
  },
  {
    title: 'Physics — Electricity',
    description: 'Electric fields, circuits, Ohm\'s Law, capacitors, inductors — the electromagnetic foundations of all electronic hardware.',
    lessons: [
      {
        title: 'Electric Circuits', order: 1,
        topics: [
          {
            title: "Ohm's Law & Circuits", order: 1,
            cards: [
              { q: "State Ohm's Law and give its formula.", a: "Voltage = Current × Resistance\nV = IR\nIn SI units: Volts = Amperes × Ohms\nMaterial is 'ohmic' if resistance R is constant regardless of V or I." },
              { q: 'What is Kirchhoff\'s Current Law (KCL)?', a: 'The sum of all currents entering a node equals the sum of all currents leaving it.\nΣI_in = Σ I_out\nConservation of charge — charge cannot accumulate at a node.' },
              { q: 'What is Kirchhoff\'s Voltage Law (KVL)?', a: 'The sum of all voltage drops around any closed loop = 0.\nΣV = 0\nConservation of energy — energy gained equals energy lost around any loop.' },
              { q: 'How do resistors add in series vs parallel?', a: 'Series: R_total = R₁ + R₂ + ... + Rₙ (same current, voltages add)\nParallel: 1/R_total = 1/R₁ + 1/R₂ + ... + 1/Rₙ (same voltage, currents add)' },
            ]
          },
        ]
      },
    ]
  },
];

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // drops and recreates all tables
  console.log('🗑  Tables reset');

  // Demo users
  const hashed = await bcrypt.hash('password123', 12);
  const today  = new Date().toISOString().split('T')[0];
  const users  = await User.bulkCreate([
    { name: 'Ada Lovelace',   email: 'ada@studex.io',   password: hashed, xp: 850, level: 9,  streak: 14, lastLoginDate: today },
    { name: 'Alan Turing',    email: 'alan@studex.io',  password: hashed, xp: 620, level: 7,  streak: 7,  lastLoginDate: today },
    { name: 'Grace Hopper',   email: 'grace@studex.io', password: hashed, xp: 430, level: 5,  streak: 3,  lastLoginDate: today },
    { name: 'Demo User',      email: 'demo@studex.io',  password: hashed, xp: 0,   level: 1,  streak: 0,  lastLoginDate: null  },
  ]);
  console.log(`✅ Created ${users.length} demo users`);

  // Courses, Lessons, Topics, Flashcards
  for (const courseData of SEED_DATA) {
    const course = await Course.create({ title: courseData.title, description: courseData.description });

    for (const lessonData of courseData.lessons) {
      const lesson = await Lesson.create({ courseId: course.id, title: lessonData.title, order: lessonData.order });

      for (const topicData of lessonData.topics) {
        const topic = await Topic.create({ lessonId: lesson.id, title: topicData.title, order: topicData.order });

        for (const card of topicData.cards) {
          await Flashcard.create({ topicId: topic.id, question: card.q, answer: card.a });
        }
      }
    }

    console.log(`  📚 ${course.title} seeded`);
  }

  // Enroll demo users in some courses
  const { Enrollment } = require('../models');
  const courses = await Course.findAll();
  await Enrollment.bulkCreate([
    { userId: users[0].id, courseId: courses[0].id },
    { userId: users[0].id, courseId: courses[3].id },
    { userId: users[1].id, courseId: courses[0].id },
    { userId: users[1].id, courseId: courses[4].id },
    { userId: users[2].id, courseId: courses[1].id },
  ]);
  console.log('✅ Enrollments created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('─────────────────────────────────────────');
  console.log('Demo accounts (password: password123):');
  console.log('  ada@studex.io     (Level 9, 850 XP)');
  console.log('  alan@studex.io    (Level 7, 620 XP)');
  console.log('  demo@studex.io    (fresh account)');
  console.log('─────────────────────────────────────────');

  await sequelize.close();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
