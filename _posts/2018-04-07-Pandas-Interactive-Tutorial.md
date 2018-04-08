---
layout: post
title: "Pandas: An Interactive Tutorial"
date: 2018-04-07
share: true
---
<style type="text/css">
.note {
    -webkit-border-radius: 6px;
    background-color: #e9ecef2e;
    border: solid 1px #343a40;
    border-radius: 10px;
    overflow: hidden;
    padding: 15px 60px;
    text-align: center;
    width: 88%;
    margin: 35px auto;
    line-height: 1.8rem;
}

#pandas {
  margin: 25px 110px 35px 110px;
}
</style>

[TODO: expand on common components (reading, manipulating, visualizing) and tedious details (data encoding/decoding, mathematical operations on columns of data)]

----------

In recent years, the Pandas library has become the de-facto standard for analyzing data in Python. Its popularity stems from how it has simplified data analysis - Pandas integrates the common components of an analysis into a single package, and abstracts away many of their tedious details. The end result is a win for data analysts, who are free to achieve their objectives quicker and with more ease.

A typical data analysis using Pandas might involve the following three steps:

1. Data is first read from a csv file into a **DataFrame**, the library's core data structure. (It is also easy to read data from other formats such as json, databases, even URLs with html tables).
2. Once loaded, the data is wrangled in a variety of ways using the DataFrame's querying interface.
3. Finally, insights are visualized using the DataFrame's convenient plotting method.

<div id="pandas">
  <a href="{{ site.baseurl }}/assets/pandas.svg">
    <img src="{{ site.baseurl }}/assets/pandas.svg">
  </a>
</div>


Pandas is a vast library, with many topics to cover, and unfortunately, a single post like this one cannot span the entire territory. It will instead begin by introducing the properties of the DataFrame, while defining the library's core terms and concepts along the way. It will then build upon to that knoweldge to explain how Pandas supports step 2 - namely, the various ways through which data residing in a DataFrame can be selected. 

<div class="note">
<strong>Note</strong>: Pandas is rich with functionality, which makes it a joy to use. However, I found (and still find) a few parts of the library to be somewhat uninintuitive. My purpose for writing this post is thus two-fold. I hope to first explain the topic at hand as simply as I possibly can. But more importantly, I hope to equip the reader with enough knowledge and context to activate his or her own course of understanding, whether that be through Googling, reading the documentation, or best of all, playing around with the library.
</div>






