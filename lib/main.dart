import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bot Controller',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final _formKey = GlobalKey<FormState>();
  final _proxiesController = TextEditingController();
  final _urlController = TextEditingController();
  final _requestsController = TextEditingController();

  Future<void> _runBot() async {
    if (_formKey.currentState!.validate()) {
      final proxies = _proxiesController.text.split(',').map((e) => e.trim()).toList();
      final url = _urlController.text;
      final numRequests = int.tryParse(_requestsController.text) ?? 1;

      final response = await http.post(
        Uri.parse('http://localhost:3000/run-bot'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'proxies': proxies,
          'targetUrl': url,
          'numRequests': numRequests,
        }),
      );

      if (response.statusCode == 200) {
        print('Bot run successfully');
      } else {
        print('Error running bot: ${response.body}');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bot Controller'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: <Widget>[
              TextFormField(
                controller: _proxiesController,
                decoration: InputDecoration(labelText: 'Proxies (comma separated)'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter proxies';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _urlController,
                decoration: InputDecoration(labelText: 'Website URL'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a URL';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _requestsController,
                decoration: InputDecoration(labelText: 'Number of Requests'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the number of requests';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _runBot,
                child: Text('Run Bot'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _proxiesController.dispose();
    _urlController.dispose();
    _requestsController.dispose();
    super.dispose();
  }
}
