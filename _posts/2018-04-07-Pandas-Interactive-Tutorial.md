---
layout: post
title: "Pandas in the NBA"
date: 2018-04-07
share: true
---

<link rel="stylesheet" type="text/css" href="{{ root_url }}/assets/css/prism.css"/>
<script src="{{ site.baseurl }}/assets/js/d3.js"></script>
<script src="{{ site.baseurl }}/assets/js/jquery.js"></script>
<style type="text/css">
.section {
  margin: 20px auto;
}
.note {
    -webkit-border-radius: 6px;
    background-color: #e9ecef52;
    border: solid 1px #343a40;
    border-radius: 10px;
    overflow: hidden;
    padding: 15px 60px;
    width: 88%;
    margin: 35px auto;
    line-height: 1.8rem;
}

.centerImgContainer {
  width: 80%;
  margin: 1rem auto;
}

pre[class*="embedded"] {
  margin-top: 20px;
  margin-bottom: 20px;
}

img.center{
  margin: 0 auto;
}

.gridContainer {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-column-gap: 0.5em;
  margin: 25px 0px;
}

.gridContainerHalf {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1em;
  margin: 25px 0px;
}
</style>

<script src="{{ site.baseurl }}/assets/js/prism.js"></script>

#### Part I: Introduction to Data Structures

[TODO: expand on common components (reading, manipulating, visualizing) and tedious details (data encoding/decoding, mathematical operations on columns of data)]

### Introduction
----------

<!-- TODO: Touch on how we will be exploring the Data Structures with NBA data -->

In recent years, the Pandas library has become the de-facto standard for analyzing data in Python. It has simplified data analysis by integrating its common components into a single package while abstracting away many tedious details. The end result is a win for analysts, who are free to achieve their objectives quicker and with more ease.

A typical data analysis using Pandas might involve the following three steps:

1. Data is first read from a csv file into a **DataFrame**, the library's core data structure. (It is also easy to read data from other formats such as json, databases, even URLs with html tables).
2. Once loaded,  data is manipulated in a variety of ways using the DataFrame's interface.
3. Insights are visualized using the DataFrame's convenient plot method.

<div class="centerImgContainer">
  <img class="center" src="{{ site.baseurl }}/assets/pandas.svg">
</div>

This post will introduce the library's two core data structures: the Series and the DataFrame. In doing so, I will first explain the library's approach to working with data, and second, familiarize the reader with the library's key terms. 

<div class="note">
<strong>Note</strong>: When writing to teach, my goal is to always explain the topic at hand as accessibly as possible. So as you will see, this post is by no means a comprehensive guide, but rather, a primer on the fundamentals. A more complete grasp of the library requires experimentation and reading the <a href="https://pandas.pydata.org/pandas-docs/stable/">documentation</a>.
<br><br>
Most of all, I hope this post reduces the friction of starting for beginners, so that they can get to the fun part faster.
</div>

Let's get to it!

#### The Series

<!-- TODO: set up shots_data.csv -->

<pre class="embedded highlight"><code class="language-python"> pd.Series(self, data=None, index=None, ...)</code></pre>
-----

To begin learning about the Series data structure, we will play around with some data about assists. The following code snippet reads a csv containing data about the league's top 10 passers, and loads it into a Series object for us to examine.

<div class="section">
<pre class="highlight"><code class="language-python">In [1]: import pandas as pd

        # Don't worry too much about what the parameters to the call mean
In [2]: assists = pd.read_csv('http://bit.ly/assist_series_csv', index_col=0, squeeze=True)

In [3]: type(assists)
Out[3]: pandas.core.series.Series

In [4]: assists
Out[4]:
PLAYER
Russell Westbrook    10.3
LeBron James          9.1
James Harden          8.8
Rajon Rondo           8.2
Ben Simmons           8.2
...                   ...
Name: AST, dtype: float64
</code></pre>
</div>

As you can see, our series has two components: a list of player names and a list of values, which are the player's assists per game for the 2017-18 regular season. In Pandas terminology, the player names are known as the **index** of our Series. One of the purposes of this index is to "name" data elements - these "names" are referred to as **labels**.

Visually, our Series looks something like this: 

<div class="centerImgContainer">
  <img class="center" height="220px" src="{{ site.baseurl }}/assets/series.svg">
</div>

<div class="note">
<strong>Note</strong>: Both the data and the index can be of any type (i.e. integers, strings, custom objects), with the one cavaet that all elements of the index must be hashable.
</div>

The index is an explicit Pandas object, and is referenced through the `.index` property:

<div class="section">
<pre class="highlight"><code class="language-python">In [1]: assists.index
Out[1]:
Index([u'Russell Westbrook', u'LeBron James', u'James Harden', u'Rajon Rondo',
       u'Ben Simmons', u'Chris Paul', u'Draymond Green', u'Jeff Teague',
       u'Kyle Lowry', u'Spencer Dinwiddie'],
      dtype='object', name=u'PLAYER')

In [2]: type(assists.index)
Out[2]: pandas.core.index.Index
</code></pre>
</div>

<div class="note">
<strong>Note</strong>: If no index is provided when the Series is created, an index of integers raging from <code class="highlighter-rouge">0</code> to <code class="highlighter-rouge">len(data) - 1</code> is provided as a default.
</div>

Index labels give the Series a "dictionary-like" interface for selecting associated data values: 
<!-- [TODO]: make the code section underneath interactive, showing how different index labals can be selected. -->


<div class="section">
<pre class="highlight"><code class="language-python">In [1]: assists['Russell Westbrook']
Out[1]: 10.3

In [2]: assists['LeBron James']
Out[2]: 9.1

In [3]: assists['Carmelo Anthony']
Traceback (most recent call last):
...
KeyError: 😂😂
</code></pre>
</div>

Aside from providing a convenient way to access data within the confines of a single Series object, the Index has another purpose, which becomes apparent when working with multiple Series.

Operations across Series objects are said to **align** on their indexes. This means that when two Series are, for example, divided together, pandas will first consult their respective indexes to determine which elements to divide. We can apply this concept of alignment to easily calculate the assist-to-turnover ratio for our top 10 passers, by dividing our `assists` series by another series containing turnover data.

<div class="note">
<strong>From the docs</strong>: The result of an operation between unaligned Series will have the union of the indexes involved. If a label is not found in one Series or the other, the result will be marked as missing <code class="highlighter-rouge">NaN</code>.
</div>

<div class="section">
<pre class="highlight"><code class="language-python">In [1]: tov = pd.read_csv('http://bit.ly/tov_series_csv', index_col=0, squeeze=True)

In [2]: tov
Out[2]:
PLAYER
Russell Westbrook    4.8
James Harden         4.4
LeBron James         4.2
Ben Simmons          3.4
Draymond Green       2.9
...                   ...
Name: TOV, dtype: float64

In [3]: ast_to_tov = assists / tov

In [4]: ast_to_tov
Out[4]:
PLAYER
Ben Simmons          2.411765
Chris Paul           3.590909
Draymond Green       2.517241
James Harden         2.000000
Jeff Teague          2.800000
...                   ...
dtype: float64
</code></pre>
</div>

<!-- <TODO: animate the svg, show the "step-wise" dividing by index alignment> -->
Visually, alignment looks something like this:

<div class="centerImgContainer">
  <img class="center" height="230px" src="{{ site.baseurl }}/assets/alignmentv1.svg">
</div>

We can use the `sort_values` method to see which one of our top 10 players had the best assist-to-turnover ratio:

<div class="section">
<pre class="highlight"><code class="language-python">In [1]: ast_to_tov.sort_values(ascending=False)
Out[1]:
PLAYER
Spencer Dinwiddie    4.125000
Chris Paul           3.590909
Rajon Rondo          3.565217
Kyle Lowry           3.000000
Jeff Teague          2.800000
...
dtype: float64
</code></pre>
</div>

As an aside, my friends and I watched Spencer Dinwiddie play for Taft High School during a tournament at our high school. The most remarkable aspect of Dinwiddie back then was how closely his name resembled "Dimwittie" - I never would have guessed he would one day be in the NBA, much less atop such an esteemed list.

By learning about the Series data structure, we learned about "labeled, aligned" data, which is a key concept in Pandas. Let's quickly recap everything we've learned, with an emphasis on the terms:

* We learned about the **Series**, which is a one-dimensional array of data values, where each element has an accompanying **label**.
* We learned that these labels are collectively known as the **Index** of a Series.
* We learned that the Index faciliates selection of data within a single Series, making the Series "dictionary-like", and I made a cheap joke at Carmelo Anthony's expense in the process.
* We learned how the Index dictates how data elements relate to each other across multiple Series objects, a property known as **alignment**.


#### The DataFrame
-----

##### Definition
<pre class="embedded highlight"><code class="language-python"> DataFrame(self, data=None, index=None, columns=None...)</code></pre>

<div class="centerImgContainer">
  <img class="center" height="175px" src="{{ site.baseurl }}/assets/dataframe.svg">
</div>

While a Series represents the idea of "labeled, aligned data" in one dimension, a DataFrame represents it in two dimensions. In the presence of this added dimension, our first order of business is to expand our notion of how a DataFrame labels our data.

Like a Series, the DataFrame has an index, but instead of labelling individual data elements, this index labels rows of data. A DataFrame also labels the columns of data, just like columns in a relational database are named. These column labels are stored in an index object.

<pre class="embedded highlight"><code class="language-python">In [1]: dataframe.index
Out[1]: Index(['a', 'b', 'c'], dtype='object')

In [2]: dataframe.columns
Out[2]: Index(['c1', 'c2', 'c3', 'c4'], dtype='object')
</code></pre>

<div class="note">
<strong>Note</strong>: Even though both rows and colums are labeled with an Index, a "DataFrame's index" always refers to the one which labels its rows.
</div>

The fact that both rows and columns are labeled with indexes lends the DataFrame a nice property. Each row in a DataFrame is a Series, where the DataFrame's columns labels are the Series' index. Each column in a DataFrame is also a Series, where the index labels are the same as the parent DataFrame's index labels.

<!-- <TODO: diagram here about selecting rows and columns yielding Series></TODO> -->

A DataFrame also provides "dictionary-like" functionality for selecting data by key. Whereas in a Series, these keys are index labels, in a DataFrame, these keys are column labels.

<pre class="embedded highlight"><code class="language-python">In [1]: df['c1']
Out[1]:
a    8
b    3
c    2
Name: c1, dtype: int64

In [2]: df['c2']
Out[2]:
a    9 
b    1
c    2
Name: c2, dtype: int64
</code></pre>

When it comes to data alignment, both index and column labels play a role. Mathematical operations (such as addition or multiplication) across DataFrames are aligned on both the column and index labels. 

<!-- <TODO: show mathematical operation></TODO> -->

However, aside from mathematical operations, index and column labels determine how a DataFrame can be extended to accomodate more data. 

Appending a Series (or another DataFrame) is the most straight-forward way to extend a DataFrame. When adding more columns to a DataFrame, incoming data is aligned on index labels. This makes it very easy to add a new column that is, for example, the product of two existing columns. Since both existing columns have, by definition, the same index, their product can be easily aligned into DataFrame as well. 

<!-- TODO: show code for adding a new product column -->

Conceptually, adding more rows to a DataFrame is the same, as incoming data is aligned on column labels. However, the code is a slightly more invovled.

<!-- TODO: show code for appending a new row -->
Let's quickly recap what we've learned about a DataFrame:

* A **DataFrame** is a two-dimensional array of data values, where **each row and column** has an accompanying label.
* While the column labels are also stored in an Index object, only the labels of the rows are known as the DataFrame's index.
* Data is aligned on both row and column labels. This is especially important because it dictates how the DataFrame can be extended to accomodate more data.


### Conclusion
We've now built up enough of a mental model to leverage the power of the Pandas Library. The next section will cover: 


