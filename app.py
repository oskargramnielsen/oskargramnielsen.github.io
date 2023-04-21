from flask import Flask, render_template

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    year = 2023  # Update with the current year
    return render_template('index.html', year=year)


@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/solardec')
def solardec():
    return render_template('solardec.html')

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')


    