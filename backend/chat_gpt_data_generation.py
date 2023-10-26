import openai

# Set up OpenAI API key
api_key = ""
openai.api_key = api_key


def raw_chatgpt_to_dict(chatgpt_output):
    for i in range(9):
        chatgpt_output = chatgpt_output.replace(str(i+1) + '. ', '#') # get rid of numbering, maybe chatgpt forgot #
        chatgpt_output = chatgpt_output.replace('#' + str(i+1), '#') # get rid of numbering
        chatgpt_output = chatgpt_output.replace(str(i+1) + '#', '#') # get rid of numbering
        
        
    chatgpt_output = chatgpt_output.replace('\n', '')              
    chatgpt_output_array = chatgpt_output.split('#')    
    chatgpt_output_array = [item for item in chatgpt_output_array if len(item) >= 8]

    chatgpt_output_dict ={}
    keylist=['answer', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6']
    nro_items = len(chatgpt_output_array)
    if nro_items>6 and nro_items<10: # we give chatgpt some slack for counting up to 7, it does not have fingers afterall
        for index, item in enumerate(chatgpt_output_array[:7]):
            chatgpt_output_dict[keylist[index]]=item
        return chatgpt_output_dict, True     
    else:
        return chatgpt_output_array, False

def answer_and_related_questions(question):
    text = '''
    Provide an 80-word answer to this question: """ ''' + question + ''' """. Give your answer
    as a summary, not a list. Based on your answer, 
    also provide seven follow-up questions. Place a hashtag (#) before and after every question and answer. 
    Do not answer the follow up questions or write anything extra."
    '''    

    message_log = [
    {"role": "system", "content": text}
    ]
    response_content = chat_completion_create(message_log)

    return response_content

def chat_completion_create(message_log):
    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",  # The name of the OpenAI chatbot model to use
    messages=message_log,   # The conversation history up to this point, as a list of dictionaries
    max_tokens=980,        # The maximum number of tokens (words or subwords) in the generated response
    stop=None,              # The stopping sequence for the generated response, if any (not used here)
    temperature=0.0,        # The "creativity" of the generated response (higher temperature = more creative)
    )
    return response.choices[0].message.content



this_question='What is ChatGPT good for?'
chatgpt_output=answer_and_related_questions(this_question)
[answer_question_dict, valid] = raw_chatgpt_to_dict(chatgpt_output)
if valid:   
    print(answer_question_dict)
else:
    print('no dice')
 