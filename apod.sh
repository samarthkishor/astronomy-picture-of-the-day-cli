#!usr/bin/env bash

node get_dates.js
python3 build_dates.py
python3 initialize_explanations.py
node get_apods.js
