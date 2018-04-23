---
layout: post
title: "Pandas: An Interactive Tutorial"
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
  margin: 2rem auto;
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

[TODO: expand on common components (reading, manipulating, visualizing) and tedious details (data encoding/decoding, mathematical operations on columns of data)]

### Introduction
----------

In recent years, the Pandas library has become the de-facto standard for analyzing data in Python. Its popularity stems from how it has simplified data analysis by integrating its common components into a single package and abstracting away many of their tedious details. The end result is a win for analysts, who are free to achieve their objectives quicker and with more ease.

A typical data analysis using Pandas might involve the following three steps:

1. Data is first read from a csv file into a **DataFrame**, the library's core data structure. (It is also easy to read data from other formats such as json, databases, even URLs with html tables).
2. Once loaded, the data is wrangled in a variety of ways using the DataFrame's querying interface.
3. Finally, insights are visualized using the DataFrame's convenient plotting method.

<div class="centerImgContainer">
  <img class="center" src="{{ site.baseurl }}/assets/pandas.svg">
</div>


Pandas is a vast library, with many topics to cover, and unfortunately, a single post is not enough to span the entire territory. Instead, this post will begin by introducing the DataFrame, while defining the library's core terms and concepts along the way. It will then build upon that knoweldge to explain how Pandas supports step 2 - namely, the various ways through which data residing in a DataFrame can be selected. 

<div class="note">
<strong>Note</strong>: Pandas is rich with functionality, which makes it a joy to use. However, I found (and still find) a few parts of the library to be somewhat uninintuitive. My purpose for writing this post is thus two-fold. I hope to first explain the topic at hand as simply as I possibly can. But more importantly, I hope to equip the reader with enough knowledge and context to activate his or her own course of understanding, whether that be through Googling, reading the documentation, or best of all, playing around with the library.
</div>


## The Building Blocks
As mentioned before, the DataFrame is the primary data structure in Pandas. But before we get into what a DataFrame is, let's begin with a simpler structure.

#### The Series
-----

<pre class="embedded highlight"><code class="language-python"> pd.Series(self, data=None, index=None, ...)</code></pre>

A Series has two components: an array of data values and an **index**, which is an accompanying array of the same length. Each element in the index effectively "names" the corresponding data element - these "names" are referred to as **labels** by the library.
[TODO]: touch on how elements of both data and the index can be of any type (index must be hashable)

<div class="gridContainer">
  <img height="200px" src="{{ site.baseurl }}/assets/list_to_series.svg">
  <pre class="highlight"><code class="language-python">import pandas as pd

data = [8, 9, 7, 5]
index = ['a', 'b', 'c', 'd']

series = pd.Series(data, index=index)
</code></pre>
</div>

It is important to note that the index is also a Pandas data structure:

<pre class="embedded highlight"><code class="language-python">In [1]: series.index
Out[1]: Index([u'a', u'b', u'c', u'd'], dtype='object')

In [2]: type(series.index)
Out[2]: pandas.core.index.Index
</code></pre>

<div class="note">
<strong>Note</strong>: If no index is provided when the Series is created, an index of integers raging from <code class="highlighter-rouge">0</code> to <code class="highlighter-rouge">len(data) - 1</code> is provided as a default.
</div>

It can be helpful to think of a Series as an "augmented" list, as index labels provide dictionary-like functionality for selecting data elements by key:
[TODO]: make the code section underneath interactive, showing how different index labals can be selected.


<div class="section">
<pre class="highlight"><code class="language-python">series['a'] = 8

series['b'] = 9

series['c'] = 7

series['d'] = 5
</code></pre>
</div>

In the context of a single Series, the index provides a convenient way to access data. But indexes play another important role, which becomes apparent when working with multiple Series.

Operations across Series objects are said to **align** on their indexes. This means that when two Series are, for example, multiplied together, pandas first consults their respective indexes to determine which elements should be multiplied together.

[TODO: animate the svg, show the "step-wise" multiplying by index alignment]

<div class="gridContainer">
  <img height="120px" src="{{ site.baseurl }}/assets/alignmentv1.svg">
  <pre class="highlight"><code class="language-python">s1 = pd.Series([2, 1], index=['A', 'B']

s2 = pd.Series([1, 2], index=['B', 'A'])

s3 = s1 * s2
</code></pre>
</div>

<div class="note">
<strong>Note</strong>: If the indexes of the two series do not match, pandas will... [TODO: complete me]
</div>

The concept of alignment by index extends beyond mathematical operations. Let's say we want to "merge" two Series, that is, combine them into a single, beefier structure. What do you think will happen?

<div class="centerImgContainer">
  <img class="center" height="150px" src="{{ site.baseurl }}/assets/merge.svg">
</div>

And with that picture in mind, we are ready to move on the DataFrame. But first, let's recap what we've learned, with an emphasis on terms.

##### Recap
* A **Series** is an array of data values, where each element of data has an accompanying **label**.
* Collectively, these labels are known as the **Index** of a Series.
* Within working with a single Series object, the Index faciliates selection of data, making the Series "dictionary-like"
* When working with multiple Series objects, the Index dictates how data elements relate to each other across each objects, a property known as **alignment**.

#### The DataFrame
-----

##### Definition
<pre class="embedded highlight"><code class="language-python"> DataFrame(self, data=None, index=None, columns=None...)</code></pre>

Series is limited. We are familiar with data presented to us in the world in tabular form: HTML tables, spreadsheets, database tables.
