import json

def escape_quotes(json_str):
    # This simple replacement handles the case you described
    return json_str.replace('"', '\\"')

# Input and output file paths
input_file = 'file_path.json' # File that needs to be cleaned up
output_file = 'file_path.json' # file name for the output

# Process the file
with open(input_file, 'r', encoding='utf-8') as infile, open(output_file, 'w', encoding='utf-8') as outfile:
    for line in infile:
        # Parse the JSON object
        try:
            data = json.loads(line.strip())
            
            # Escape quotes in the 'name' field if it exists
            if 'name' in data:
                data['name'] = escape_quotes(data['name'])
            
            # Write the modified JSON object to the output file
            json.dump(data, outfile, ensure_ascii=False)
            outfile.write('\n')
        except json.JSONDecodeError as e:
            print(f"Error in line: {line.strip()}")
            print(f"Error message: {str(e)}")

print(f"Processed JSON saved to {output_file}")
