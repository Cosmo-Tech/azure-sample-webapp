# Flowchart data generator

This script generates a JSON file containing a flowchart instance, from an Excel input file. This JSON content can the
be used in the webapp, in the chart of the Simulation view.

## Usage

```
usage: flowchart_data_generator.py [-h] --input INPUT [--output OUTPUT] [--force] [--pretty]

Parse Excel instance file to generate flowchart data.

options:
  -h, --help            show this help message and exit
  --input INPUT, -i INPUT
                        Path to input XLSX file
  --output OUTPUT, -o OUTPUT
                        Path to output JSON file
  --force, -f           Force file creation even if the output file already exists
  --pretty, -p          Enable pretty print for the output JSON file

```

## Examples

`python3 flowchart_data_generator.py -i MyDemoInstance.xlsx`

`python3 flowchart_data_generator.py -i MyDemoInstance.xlsx -o flowchartInstance.json`

`python3 flowchart_data_generator.py -i MyDemoInstance.xlsx -o flowchartInstance.json -f -p`
