import json
import re

def escape_quotes(json_str):
    # This regex looks for strings within JSON that aren't already escaped
    pattern = r'(?<!\\)"(?:[^"\\]|\\.)*"'
    
    def replace(match):
        # For each matched string, replace unescaped quotes with escaped ones
        s = match.group(0)
        return s.replace('\\"', '"').replace('"', '\\"')
    
    # Apply the regex substitution
    escaped_str = re.sub(pattern, replace, json_str)
    return escaped_str

# Input and output file paths
input_file = 'yelp_academic_dataset_business.json'
output_file = 'yelp_academic_dataset_business_output.json'

# Process the file
with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
    for line in infile:
        # Escape quotes in the line
        escaped_line = escape_quotes(line.strip())
        
        # Validate the JSON
        try:
            json.loads(escaped_line)
            outfile.write(escaped_line + '\n')
        except json.JSONDecodeError as e:
            print(f"Error in line: {line.strip()}")
            print(f"Error message: {str(e)}")

print(f"Processed JSON saved to {output_file}")
