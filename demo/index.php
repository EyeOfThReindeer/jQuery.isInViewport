<html>
    <head>
        <link rel="stylesheet" href="./style.css"/>
        <title>jQuery.isInViewport demo</title>
    </head>
    <body>
        <div id="page">
            <h1>
                jQuery.isInViewport demo
            </h1>
            <p>
                Check the source code on: <a href="https://github.com/EyeOfThReindeer/jQuery.isInViewport">GitHub page</a>.
            </p>
            <div id="demo">
                <div id="viewport">
                    <div id="wrapper">
                        <div id="element" data-dimension="vertical">

                        </div>
                    </div>
                </div>
                <div id="debug">
                    <div id="buttons">
                        <button id="vertical" class="active button" data-dimension="vertical">Vertical</button>
                        <button id="horizontal" class="button" data-dimension="horizontal">Horizontal</button>
                        <button id="both" class="button" data-dimension="both">Both</button>
                    </div>
                    <div id="message">
                        Test the scrolling
                    </div>
                    <pre id="code">
                
                    </pre>
                </div>
            </div>
        </div>
        <script
            src="https://code.jquery.com/jquery-3.2.1.min.js"
            integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
            crossorigin="anonymous">
        </script>
        <script type="text/javascript" src="../jQuery.isInViewport.js"></script>
        <script type="text/javascript" src="./script.js"> </script>
    </body>
</html>