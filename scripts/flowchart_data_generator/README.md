# Flowchart data generator

This script generates JSON files containing flowchart data, from an Excel input file and CSV files with simulation
results. These JSON files can then be used by the webapp to display the graph and charts in the Simulation view.

## Setup

```bash
# From the flowchart_data_generator folder
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Usage

```
usage: flowchart_data_generator.py [-h] --input INPUT [--results RESULTS] [--output OUTPUT] [--force]
                                   [--pretty]

Parse Excel instance file to generate flowchart data.

options:
  -h, --help            show this help message and exit
  --input INPUT, -i INPUT
                        Path to input XLSX file
  --results RESULTS, -r RESULTS
                        (optional) Path to input folder containing the simulation results
  --output OUTPUT, -o OUTPUT
                        Path to output folder
  --force, -f           Force file creation even if the output folder already exists
  --pretty, -p          Enable pretty print for the output JSON files

```

## Examples

`python3 flowchart_data_generator.py -i MyDemoInstance.xlsx -r myResultsFolder`

`python3 flowchart_data_generator.py -i MyDemoInstance.xlsx -r myResultsFolder -o myOutputFolder`

`python3 flowchart_data_generator.py -i MyDemoInstance.xlsx -r myResultsFolder -o myOutputFolder -f -p`
