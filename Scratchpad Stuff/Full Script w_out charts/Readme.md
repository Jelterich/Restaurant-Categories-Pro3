## Steps to run

# 1
Add the original Yelp .json, 'yelp_academic_dataset_business.json', to the folder.
# 2
open folder in bash. run 'Python test.py'


## Install Mermaid extension to view: I used Markdown Preview Mermaid Support. Upper right corner by the play button, one of those is an option to open preview.

```mermaid
graph TD
    A[Download 'Full Script w_out charts' folder] --> B[Copy 'yelp_academic_dataset_business.json' into folder]
    B --> C[Open folder path in Bash]
    C --> D[Run Python test.py]
    D --> E[test.py will Import .json file and then:]
    E --> F[Convert json to dataframe]
    F --> G[Clean results to show only restaurants]
    G --> H[Create unique list of restaurant categories]
    G --> I[Create MongoDB table for dataframe]
    H & I --> J[Create Flask server]
    J --> K[flasktest.js connects to Flask server]
    K --> L[index copy.html creates layout]
    L --> M[Display dropdown with categories]
    M --> N[User selects category]
    N --> O[Pass selection as query to server]
    O --> P[Query results returned]
    P --> Q[Populate charts with results]
```
