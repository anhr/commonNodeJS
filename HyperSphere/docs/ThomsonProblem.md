### The Thomson Problem

 
**Definition**

The Thomson Problem asks for the minimum energy configuration of $N$ point charges on a unit sphere that repel each other with an electrostatic force (Coulomb's Law). The potential energy $U$ of the system is given by the sum of the inverse distances between all pairs of particles:

```math
U = \sum_{1 \le i < j \le N} \frac{1}{|r_i - r_j|}
```

The goal is to find the arrangement of these $N$ points that minimizes this total potential energy $U$.

**Physical Significance**

Named after physicist J.J. Thomson (who proposed it in 1904 after his discovery of the electron), the problem is a fundamental challenge in geometry and physics. While it is simple to state, finding the global minimum for arbitrary $N$ is computationally difficult (NP-hard).

**Complexity**

As the number of points $N$ increases, the number of local minima grows exponentially. Simple gradient descent algorithms often get "trapped" in these local configurations, failing to reach the true global minimum. This is why specialized computational methods—such as the iterative repulsion algorithm used in this application—are required to find high-symmetry, stable structures.

**Applications**

Beyond theoretical physics, the Thomson Problem serves as a model for:
* The arrangement of proteins on the surface of viruses.
* The configuration of atoms in fullerene molecules.
* Optimization problems in material science and nanotechnology.

---

## References

*   [Thomson Problem — Wolfram MathWorld](https://mathworld.wolfram.com/ThomsonProblem.html)
*   My prompts in [deepseek](https://chat.deepseek.com/share/rrsnfgrld19o8jwxzv)
*   My prompts in [gemini](https://gemini.google.com/app/9b3e6992edd358a4)
