from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

class StoryNode:
    def __init__(self, text, options, status='ongoing'):
        self.text = text
        self.options = options
        self.status = status

story = {
    'start': StoryNode(
        'Kaveri stands at the entrance of a mysterious forest. What will she do? (enter/stay)',
        {'enter': 'enter_forest', 'stay': 'stay_entrance'}
    ),
    'enter_forest': StoryNode(
        'Kaveri enters the forest and finds a magical key lying on the ground. What will she do? (take/leave)',
        {'take': 'take_key', 'leave': 'leave_forest'}
    ),
    'stay_entrance': StoryNode(
        'Kaveri stays at the entrance and finds a hint about the forest: "The key to the mystery lies within." (enter)',
        {'enter': 'enter_forest'}
    ),
    'take_key': StoryNode(
        'Kaveri takes the key and notices a mysterious cave ahead. What will she do? (explore/ignore)',
        {'explore': 'explore_cave', 'ignore': 'ignore_cave'}
    ),
    'leave_forest': StoryNode(
        'Kaveri leaves the forest and her adventure ends. The end.',
        {}, 'failed'
    ),
    'explore_cave': StoryNode(
        'Kaveri explores the cave and finds a hidden treasure. The end.',
        {}, 'won'
    ),
    'ignore_cave': StoryNode(
        'Kaveri ignores the cave and continues her journey. The end.',
        {}, 'won'
    )
}

def get_story_response(current_node, user_input):
    print(f"User input: {user_input}")  # Debug print
    print(f"Current node: {current_node}")  # Debug print
    print(f"Available options: {list(story[current_node].options.keys())}")  # Debug print

    if user_input in story[current_node].options:
        current_node = story[current_node].options[user_input]
        print(f"New current node: {current_node}")  # Debug print
        response_text = story[current_node].text
        options = list(story[current_node].options.keys())
        status = story[current_node].status
        return response_text, options, status, current_node
    else:
        print("Invalid option selected.")  # Debug print
        print(f"Expected one of: {list(story[current_node].options.keys())}, but got: {user_input}")  # Debug print
        return "I don't understand. Please choose a valid option.", [], 'ongoing', current_node

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data['message'].lower()
    current_node = data.get('current_node', 'start')
    print(f"Received input: {user_input}")  # Debug print
    story_response, options, status, current_node = get_story_response(current_node, user_input)
    print(f"Response: {story_response}, Options: {options}, Status: {status}, New current node: {current_node}")  # Debug print
    return jsonify(response=story_response, options=options, status=status, current_node=current_node)

if __name__ == '__main__':
    app.run(debug=True)
