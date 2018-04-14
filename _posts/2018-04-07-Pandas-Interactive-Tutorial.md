---
layout: post
title: "Pandas: An Interactive Tutorial"
date: 2018-04-07
share: true
---

<link rel="stylesheet" type="text/css" href="{{ root_url }}/assets/css/prism.css"/>
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

#pandas {
  width: 80%;
  margin: 2rem auto;
}

pre[class*="embedded"] {
  margin-top: 20px;
  margin-bottom: 20px;
}

img .center{
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

<div id="pandas">
  <img class="center" src="{{ site.baseurl }}/assets/pandas.svg">
</div>


Pandas is a vast library, with many topics to cover, and unfortunately, a single post is not enough to span the entire territory. Instead, this post will begin by introducing the DataFrame, while defining the library's core terms and concepts along the way. It will then build upon that knoweldge to explain how Pandas supports step 2 - namely, the various ways through which data residing in a DataFrame can be selected. 

<div class="note">
<strong>Note</strong>: Pandas is rich with functionality, which makes it a joy to use. However, I found (and still find) a few parts of the library to be somewhat uninintuitive. My purpose for writing this post is thus two-fold. I hope to first explain the topic at hand as simply as I possibly can. But more importantly, I hope to equip the reader with enough knowledge and context to activate his or her own course of understanding, whether that be through Googling, reading the documentation, or best of all, playing around with the library.
</div>


### The Building Blocks
------
As mentioned before, the DataFrame is the primary data structure in Pandas. But before we get into what a DataFrame is, let's begin with a simpler structure: the **Series**.

<pre class="embedded highlight"><code class="language-python"> pd.Series(self, data=None, index=None, ...)</code></pre>

A Series has two components: an array of data values accompanied by an **index**, which is an array of the same length. Each element in the index effectively "names" the corresponding data element - these "names" are referred to as **labels** by the library. 

<div class="note">
<strong>Note</strong>: If no index is provided when the Series is created, an index of integers raging from <code class="highlighter-rouge">0</code> to <code class="highlighter-rouge">len(data) - 1</code> is provided as a default.
</div>

<div class="gridContainer">
  <img height="200px" src="{{ site.baseurl }}/assets/list_to_series.svg">
  <pre class="highlight"><code class="language-python">import pandas as pd

data = [8, 9, 7, 5]
index = ['a', 'b', 'c', 'd']

series = pd.Series(data, index=index)
</code></pre>
</div>

It can helpful to think of a Series as an "augmented" list, where labels provide the dictionary-like functionality for selecting data by key:

<div class="section">
<pre class="highlight"><code class="language-python">series['a'] = 8

series['b'] = 9

series['c'] = 7

series['d'] = 5
</code></pre>
</div>

Within a single Series, the index provides a convenient way to access data. But they play another important role, which becomes important when working with multiple "labeled" data structures.

#### Data Alignment

<img src="{{ site.baseurl }}/assets/alignment.svg">
