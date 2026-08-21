---
source: https://artofproblemsolving.com/wiki/index.php/Binet%27s_Formula
---
If $F_n$ is the $n$th Fibonacci number, then

$$
F_n=\frac{1}{\sqrt{5}}\left(\left(\frac{1+\sqrt{5}}{2}\right)^n-\left(\frac{1-\sqrt{5}}{2}\right)^n\right)
$$

To derive a general formula for the Fibonacci numbers, we can look at the interesting quadratic
$$
x^2-x-1=0
$$

Begin by noting that the roots of this quadratic are $\frac{1 \pm \sqrt{5}}{2}$ according to the quadratic formula. This quadratic can also be written as
$$
x^2=x+1 .
$$

From this, we can write expressions for all $x^n$ :

$$
\begin{aligned}
x & =x \\
x^2 & =x+1 \\
x^3 & =x \cdot x^2 \\
& =x \cdot(x+1) \\
& =x^2+x \\
& =(x+1)+x \\
& =2 x+1 \\
x^4 & =x \cdot x^3 \\
& =x \cdot(2 x+1) \\
& =2 x^2+x \\
& =2(x+1)+x \\
& =3 x+2 \\
x^5 & =5 x+3 \\
x^6 & =8 x+5
\end{aligned}
$$

We note that

$$
x^n=F_n x+F_{n-1}
$$

Let the roots of our original quadratic be $\sigma=\frac{1+\sqrt{5}}{2}$ and $\tau=\frac{1-\sqrt{5}}{2}$. Since both $\sigma$ and $\tau$ are roots of the quadratic, they must both satisfy $x^n=F_n x+F_{n-1}$. So

$$
\sigma^n=F_n \sigma+F_{n-1}
$$
and
$$
\tau^n=F_n \tau+F_{n-1}
$$

Subtracting the second equation from the first equation yields

$$
\begin{aligned}
\sigma^n-\tau^n & =F_n(\sigma-\tau)+F_{n-1}-F_{n-1} \\
\left(\frac{1+\sqrt{5}}{2}\right)^n-\left(\frac{1-\sqrt{5}}{2}\right)^n & =F_n\left(\frac{1+\sqrt{5}}{2}-\frac{1-\sqrt{5}}{2}\right)
\end{aligned}
$$

This yields the general form for the nth Fibonacci number:

$$
F_n=\frac{\left(\frac{1+\sqrt{5}}{2}\right)^n-\left(\frac{1-\sqrt{5}}{2}\right)^n}{\sqrt{5}}
$$