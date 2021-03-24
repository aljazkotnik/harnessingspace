(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // Refactor into blocks??
  // General helpers
  var helpers = {
    isIterable: function isIterable(object) {
      // https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
      return object != null && typeof object[Symbol.iterator] === 'function';
    },
    // isIterable
    makeTranslate: function makeTranslate(x, y) {
      return "translate(" + x + "," + y + ")";
    },
    // makeTranslate
    // Arrays
    unique: function unique(d) {
      // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      } // unique


      return d.filter(onlyUnique);
    },
    // unique
    arrayEqual: function arrayEqual(A, B) {
      return helpers.arrayIncludesAll(A, B) && helpers.arrayIncludesAll(B, A);
    },
    // arrayEqual
    arrayIncludesAll: function arrayIncludesAll(A, B) {
      // 'arrayIncludesAll' checks if array A includes all elements of array B. The elements of the arrays are expected to be strings.
      // Return element of B if it is not contained in A. If the response array has length 0 then A includes all elements of B, and 'true' is returned.
      var f = B.filter(function (b) {
        return !A.includes(b);
      });
      return f.length == 0 ? true : false;
    },
    // arrayIncludesAll
    indexOfObjectByAttr: function indexOfObjectByAttr(array, attr, value) {
      // Return hte index of the first object with the attribute 'attr' of value 'value'. 
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }

      return -1;
    },
    // indexOfObjectByAttr
    findObjectByAttribute: function findObjectByAttribute(A, attribute, values, flag) {
      // Return the objects in an object array 'A', which have an attribute 'attribute', with the value 'value'. If they do not an empty set is returned. In cases when a single item is selected the item is returned as the object, without the wrapping array.
      var subset = A.filter(function (a) {
        return values.includes(a[attribute]);
      }); // If only one output is expected, return a single output.

      if (subset.length > 0 && flag == 1) {
        subset = subset[0];
      } // if


      return subset;
    },
    // findObjectByAttribute
    collectObjectArrayProperty: function collectObjectArrayProperty(A, attribute) {
      // Take input object array 'A', collect all of the object members attribute 'attribute', and flattens the array of arrays into a single array of values once.
      var C = A.map(function (a) {
        return a[attribute];
      });
      return [].concat.apply([], C);
    },
    // collectObjectArrayProperty
    setDifference: function setDifference(A, B) {
      var a = new Set(A);
      var b = new Set(B);
      return {
        aMinusB: new Set(_toConsumableArray(a).filter(function (x) {
          return !b.has(x);
        })),
        bMinusA: new Set(_toConsumableArray(b).filter(function (x) {
          return !a.has(x);
        }))
      };
    },
    // setDifference
    // Comparing file contents
    // Text sizing
    fitTextToBox: function fitTextToBox(text, box, dim, val) {
      // `text' and `box' are d3 selections. `dim' must be either `width' or `height', and `val' must be a number.
      if (["width", "height"].includes(dim) && !isNaN(val)) {
        var fontSize = 16;
        text.style("font-size", fontSize + "px");

        while (box.node().getBoundingClientRect()[dim] > val && fontSize > 0) {
          // Reduce the font size
          fontSize -= 1;
          text.style("font-size", fontSize + "px");
        } // while

      } // if

    },
    // fitTextToBox
    calculateExponent: function calculateExponent(val) {
      // calculate the exponent for the scientific notation.
      var exp = 0;

      while (Math.floor(val / Math.pow(10, exp + 1)) > 0) {
        exp += 1;
      } // Convert the exponent to multiple of three


      return Math.floor(exp / 3) * 3;
    },
    // calculateExponent
    // FILES
    createFileInputElement: function createFileInputElement(loadFunction) {
      // This button is already created. Just add the functionaity.
      var dataInput = document.createElement('input');
      dataInput.type = 'file';

      dataInput.onchange = function (e) {
        loadFunction(e.target.files);
      }; // onchange


      return dataInput;
    } // createFileInputElement

  }; // helpers

  var errors = {
    /* ERRORS SHOULD (!!!) BE LOGGED IN AN ERROR OBJECT TO ALLOW THE FAULTY FILES TO BE RELEASED FROM MEMORY!!
    		Errors are loged into a single array, as it is easier to have all the error sorting in the errors object, rather than scattered throughout the loaders.
    		Maybe split of the error handling into a separate module?? A sort of reporting module? Add the report generation to it here!
    		*/
    log: [],
    // log
    report: {
      generate: function generate() {
        // Create a section for each of the files. On-demand files should be grouped by the metadata file that asks for it. 
        // Group all errors by their requester.
        var report = errors.log.reduce(function (acc, er) {
          if (acc[er.requester]) {
            acc[er.requester].push(er);
          } else {
            acc[er.requester] = [er];
          } // if


          return acc;
        }, {}); // Errors with user requested files (on-demand files loaded by the user through the UI) should just be reported as individual items.
        // On-demand files requested indirectly (from metadata) can fail only if the metadata was successfully loaded beforehand. Therefore if the metadata load fails, then the on-demand files will not be loaded at all. Therefore the report as it stands is sufficient! Submenu functionality is not needed!
        // This report will be bound to the DOM, and as each attribute in report is supposed to have a corresponding DOM element, the report should be an array!!

        var reportArray = Object.getOwnPropertyNames(report).map(function (name) {
          return {
            title: name,
            content: report[name]
          };
        });
        return reportArray;
      },
      // generate
      // Outside INTERACTIVITY
      show: function show() {
        var fullscreenContainer = d3.select("#report-container");
        fullscreenContainer.style("display", "");
      },
      // show
      hide: function hide() {
        var fullscreenContainer = d3.select("#report-container"); // Hide the container. Bring up the variable handling.

        fullscreenContainer.style("display", "none");
      },
      // hide
      // BUILDER
      builder: {
        make: function make() {
          // Clear the parent.
          var parent = d3.select("#report-container");
          parent.selectAll("*").remove(); // Collect the error data. The error report should be an array!!

          var errorReport = errors.report.generate(); // Build the DOM

          errors.report.builder.build.menu(parent, errorReport); // Make it interactive!

          var menus = parent.node().querySelectorAll(".accordion");
          errors.report.builder.addFunctionality(menus);
        },
        // make
        build: {
          menu: function menu(parent, report) {
            // Have the fullscreen container in index.html
            var menuContainer = parent.append("div").attr("class", "card card-menu");
            menuContainer.append("div").attr("class", "card-header").append("h1").html("Report:"); // Body

            var varCategories = menuContainer.append("div").attr("class", "card-body").style("overflow-y", "auto").style("overflow-x", "auto").selectAll("div").data(report).enter().append("div").each(function (d) {
              errors.report.builder.build.submenu(d3.select(this), d);
            }); // Footer

            menuContainer.append("div").attr("class", "card-footer").append("button").attr("class", "btn btn-success").html("Understood").on("click", errors.report.hide);
          },
          // menu
          submenu: function submenu(parent, itemReport) {
            // Builds the whole menu item, which will be an accordion menu.
            var button = parent.append("button").attr("class", "accordion").style("outline", "none");
            button.append("strong").html(itemReport.title);
            button.append("span").attr("class", "badge badge-pill badge-info").style("float", "right").html(itemReport.content.length);
            var content = parent.append("div").attr("class", "panel").append("ul");
            content.selectAll("li").data(itemReport.content).enter().append("li").html(errors.report.builder.build.item); // url requester interpreter error

            return content;
          },
          // submenu
          item: function item(_item) {
            // No need to report the requestor - this is communicated b the menu structure!
            // When classifying csv variables onDemandData is used for probable files. Otherwise the classifier restricts the file types!
            return "<b>".concat(_item.url, "</b> interpreted as <b>").concat(_item.interpreter, "</b> produced <b>").concat(_item.report.message.fontcolor("red"), "</b>");
          } // item

        },
        // build
        addFunctionality: function addFunctionality(menus) {
          // Opening the menus.
          for (var i = 0; i < menus.length; i++) {
            menus[i].addEventListener("click", function () {
              this.classList.toggle("active");
              var panel = this.nextElementSibling;

              if (panel.style.display === "block") {
                panel.style.display = "none";
              } else {
                panel.style.display = "block";
              }
            });
          } // for

        } // addFunctionality

      } // builder

    } // report

  }; // errors

  var dbsliceFile = /*#__PURE__*/function () {
    function dbsliceFile(file, requester) {
      _classCallCheck(this, dbsliceFile);

      // How to load if file is an actual File object.
      if (file instanceof File) {
        file = {
          url: URL.createObjectURL(file),
          filename: file.name
        };
      } // if


      this.url = file.url;
      this.filename = file.filename;
      this.extension = file.filename.split(".").pop();
      this.promise = undefined; // Also log the requestor. If this was passed in then use the passed in value, otherwise the requestor is the user.

      this.requester = requester ? requester : "User";
    } // constructor


    _createClass(dbsliceFile, [{
      key: "load",
      value: function load() {
        // Collect the data and perform input testing.
        var obj = this; // Based on the url decide how to load the file.

        var loader;

        switch (this.extension) {
          case "csv":
            loader = function loader(url) {
              return d3.csv(url);
            };

            break;

          case "json":
            loader = function loader(url) {
              return d3.json(url);
            };

            break;

          default:
            // Return a rejected promise as the file extension is wrong.
            loader = function loader() {
              return Promise.reject(new Error("LoaderError: Unsupported Extension"));
            };

            break;
        }
        // Wrap in a larger promise that allows the handling of exceptions.

        var loadPromise = new Promise(function (resolve, reject) {
          // If the URL points to a non-existing file the d3 loader will reject the promise and throw an error, but still proceed down the resolve branch!
          loader(obj.url).then(function (content) {
            // Since d3 insists on running the resolve branch even though it doesn't find the file, handle missing contents here.
            // csv files are always read as strings - convert numbers to numbers. Should be done here. If it's done in a preceeding promise then the error is lost.
            obj.content = content;
            resolve(obj);
          }, function (e) {
            // 'e' is an error triggered during loading.
            // The two errors that can enter here are file missing, and a problem reading the file.
            // This routes any errors that d3 might have into hte new promise.
            reject(e);
          });
        }).then(this.format).then(this.onload)["catch"](function (e) {
          // This catches all the rejects. 'e' is the field into which the error can be logged.
          delete obj.content;
          errors.log.push({
            url: obj.url,
            interpreter: obj.constructor.name,
            report: e,
            requester: obj.requester
          });
          return obj;
        });
        this.promise = loadPromise;
      } // load

    }, {
      key: "onload",
      value: function onload(obj) {
        return obj;
      } // onload

    }, {
      key: "format",
      value: function format(obj) {
        return obj;
      } // format

    }], [{
      key: "testrow",
      value: // test
      // Maybe move these to helpers??
      function testrow(array) {
        if (array.length > 0) {
          var i = Math.floor(Math.random() * array.length);
          return {
            i: i,
            row: array[i]
          }; // return
        } else {
          throw new Error("InvalidInput: Array without entries");
        } // if

      } // testrow

    }, {
      key: "convertNumbers",
      value: function convertNumbers(array) {
        return array.map(function (row) {
          var r = {};

          for (var k in row) {
            r[k] = +row[k];

            if (isNaN(r[k])) {
              r[k] = row[k];
            } // if

          } // for


          return r;
        });
      } // convertNumbers

    }]);

    return dbsliceFile;
  }(); // dbsliceFile
  // Declare file types here.

  dbsliceFile.test = {
    structure: function structure(fileClass, content) {
      // This an abstract test director. When a file is loaded the file classes do not know exactly how to handle to contents. This test director tries different implemented approaches to reformat the data, and stops when a suitable approach is found. In the future this may be extended to the point where the test involves performing a dummy plotting operation, as the plotting is the last operation to be performed on the file data.
      var content_; // No differentiating between the structure or the content failing - the file classes are trying several different structures.
      // Try to use all different file structures possible.

      Object.getOwnPropertyNames(fileClass.structure).every(function (name) {
        try {
          content_ = fileClass.structure[name](content); // Return false breaks the loop. This return is reached only if the test was successfully performed and passed.

          return content_ ? false : true;
        } catch (e) {
          // Keep looping
          content_ = undefined;
          return true;
        } // try

      }); // forEach

      if (content_) {
        // Restructuring succeeded.
        return content_;
      } else {
        throw new Error("InvalidFile: Unsupported data structure");
      } // if

    } // structure

  };
  var metadataFile$1 = /*#__PURE__*/function (_dbsliceFile) {
    _inherits(metadataFile, _dbsliceFile);

    var _super = _createSuper(metadataFile);

    function metadataFile() {
      var _this;

      _classCallCheck(this, metadataFile);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      _this.classify = {
        all: function all(obj) {
          // This already executes in a promise chain, therefore it's not needed to update the obj.promise. The promises created here will be resolved before the overhead promise resolves further.
          // Create all the testing promises.
          var testPromises = obj.content.variables.map(function (variable) {
            // Check this column. Variable is now an object!
            return obj.classify.variable(obj, variable);
          }); // Return the final promise.

          return Promise.all(testPromises).then(function (variableClassification) {
            // The promises update the variable classification into the file object directly.
            // After the classification is finished add a header to the file. This is the header that allows this file to be passed straight to dbsliceData.
            obj.content.header = {};
            categoryInfo.supportedCategories.forEach(function (category) {
              // Find all the variables that fit into this particular category.
              var categoryVariables = obj.content.variables.filter(function (d) {
                return d.category == category;
              });
              obj.content.header[categoryInfo.cat2prop[category]] = categoryVariables.map(function (d) {
                return d.name;
              });
            });
            return obj;
          });
        },
        // all
        variable: function variable(obj, _variable) {
          // Retrieve an actual value already.
          var testrow = dbsliceFile.testrow(obj.content.data);
          var testval = testrow.row[_variable.name]; // Split the testing as per the variable type received.

          var promise;

          switch (_typeof(testval)) {
            case "string":
              // String can be a file too.
              _variable.type = "string";
              promise = obj.classify.string(obj, _variable, testval);
              break;

            case "number":
              _variable.category = "ordinal";
              _variable.type = "number";
              promise = _variable;
              break;

            default:
              _variable.category = "Unused";
              _variable.type = undefined;
              promise = _variable;
          } // switch


          return promise;
        },
        // variable
        string: function string(obj, variable, testval) {
          // If the string is a file, load it in to identify it's structure. It's not important which extension the file has, but what is it's internal structure.
          // 'obj' is needed to construct an on-load response, 'variable' and 'testval' to have the name value pair.  
          var promise; // Create a new onDemandFile to load in it's contents.

          switch (testval.split(".").pop()) {
            case "json":
            case "csv":
              // Try to classify the testval as a file. The requester is the metadata for which the variables are being classified.
              var testFile = new onDemandFile({
                url: testval,
                filename: testval
              }, obj.filename);
              promise = obj.classify.file(variable, testFile);
              break;

            default:
              // Unsupported extension.
              variable.category = "categorical";
              promise = variable;
          } // switch


          return promise;
        },
        // string
        file: function file(variable, testFile) {
          // Make a new generic on-demand file, and return a promise that will return the file type.
          testFile.load(); // What can go wrong:
          // file is not found
          // file has wrong content
          // Below 'obj' represents 'testFile'.

          return Promise.all([testFile.promise]).then(function (obj) {
            // It's possible that hte file was found and loaded correctly. In that case 'obj.content.format' will contain the name of the file type. Otherwise this field will not be accessible.
            try {
              // Category is the categorisation that will actually be used, and type cannot be changed.
              variable.category = obj[0].content.format;
              variable.type = obj[0].content.format;
              return variable;
            } catch (_unused) {
              // If the loading failed for whatever reason the variable is retained as a categorical.
              variable.category = "categorical";
              return variable;
            } // try

          });
        } // file

      };
      return _this;
    }

    _createClass(metadataFile, [{
      key: "onload",
      value: function onload(obj) {
        // This executes in a promise chain, therefore the overhead promise will wait until thiss is fully executed.
        // Check if suitable categories have already been declared.
        var classificationPromise;

        if (!obj.content.header) {
          // Launch the variable classification.
          classificationPromise = obj.classify.all(obj);
        } else {
          classificationPromise = Promise.resolve().then(function (d) {
            return obj;
          });
        } // if 
        // To ensure that the classification is included into the loading promise chain a promise must be returned here. This promise MUST return obj. 'classify.all' returns a promise, which returns the object with the classified variables.


        return classificationPromise;
      } // onload

    }, {
      key: "format",
      value: function format(obj) {
        // Restructure the data into an expected format
        obj.content = dbsliceFile.test.structure(metadataFile, obj.content);
        return obj;
      } // format

    }], [{
      key: "cat2var",
      value: // classify
      // Where is this used??
      function cat2var(categories) {
        // If categories are given, just report the categorisation. But do check to make sure all of the variables are in the categories!! What to do with label and taskId??
        var variables = [];
        var declaredVariables;
        Object.getOwnPropertyNames(categories).forEach(function (category) {
          if (categoryInfo.supportedCategories.includes(category)) {
            declaredVariables = categories[category].map(function (d) {
              return {
                name: d,
                category: category,
                type: categoryInfo.cat2type[category]
              };
            });
            variables = variables.concat(declaredVariables);
          } // if

        }); // Check that all hte variables are declared!

        return variables;
      } // category2variable

    }]);

    return metadataFile;
  }(dbsliceFile); // metadataFile
  // For a general unknown on-demand file

  metadataFile$1.structure = {
    csv2metadataFile: function csv2metadataFile(content) {
      var content_; // Data values need to be converted to numbers. Convert the 'variables' into objects?

      content_ = {
        variables: content.columns.map(function (d) {
          return {
            name: d,
            category: undefined,
            type: undefined
          };
        }),
        data: dbsliceFile.convertNumbers(content)
      };
      metadataFile$1.test.content(content_);
      delete content_.data.columns;
      return content_;
    },
    // csv2metadataFile
    json2metadataFile: function json2metadataFile(content) {
      var content_;
      content_ = {
        variables: Object.getOwnPropertyNames(dbsliceFile.testrow(content.data).row).map(function (d) {
          return {
            name: d,
            category: undefined,
            type: undefined
          };
        }),
        data: content.data
      }; // Check if declared variables contain all variables in the data.

      var allVariablesDeclared = helpers.arrayEqual(metadataFile$1.cat2var(content.header).map(function (d) {
        return d.name;
      }), content_.variables.map(function (d) {
        return d.name;
      })); // All variables are declared, but have they been declared in the right categories??

      if (allVariablesDeclared) {
        // All variables have been declared. The categories can be assigned as they are.
        content_.variables = metadataFile$1.cat2var(content.header);
      } // if


      metadataFile$1.test.content(content_);
      return content_;
    } // json2metadataFile

  };
  metadataFile$1.test = {
    content: function content(_content) {
      // Columns require a taskId property.
      // Declared categories must contain all variables.
      // All rows must be the same lenght
      // There must be some rows.
      // Data must be iterable
      // Check if the data is an array (has function length)
      var isThereAnyData = Array.isArray(_content.data) && _content.data.length > 0; // Test to make sure all rows have the same number of columns.

      var areRowsConsistent = true;
      var testrow = dbsliceFile.testrow(_content.data).row;

      _content.data.forEach(function (row) {
        areRowsConsistent && (areRowsConsistent = helpers.arrayEqual(Object.getOwnPropertyNames(testrow), Object.getOwnPropertyNames(row)));
      }); // forEach


      return isThereAnyData && areRowsConsistent;
    } // content

  };
  var onDemandFile = /*#__PURE__*/function (_dbsliceFile2) {
    _inherits(onDemandFile, _dbsliceFile2);

    var _super2 = _createSuper(onDemandFile);

    function onDemandFile() {
      _classCallCheck(this, onDemandFile);

      return _super2.apply(this, arguments);
    }

    _createClass(onDemandFile, [{
      key: "onload",
      value: function onload(obj) {
        // During the data formatting the format of the file is determined already. Here just report it onwards.
        return obj;
      } // onload

    }, {
      key: "format",
      value: function format(obj) {
        // Here try all different ways to format the data. If the formatting succeeds, then check if the contents are fine.
        var availableFileClasses = [line2dFile, contour2dFile]; // Here just try to fit the data into all hte supported data formats, and see what works.

        var format;
        availableFileClasses.every(function (fileClass) {
          try {
            // The structure test will throw an error if the content cannot be handled correctly.
            dbsliceFile.test.structure(fileClass, obj.content); // This file class can handle the data.

            format = fileClass.name;
          } catch (_unused2) {
            return true;
          } // if

        }); // Output the object, but add it's format to the name.

        if (format) {
          obj.content.format = format;
          return obj;
        } else {
          throw new Error("InvalidFile: Unsupported data structure");
        } // if

      } // format
      // test

    }]);

    return onDemandFile;
  }(dbsliceFile); // onDemandFile
  // Established on-demand files

  onDemandFile.test = {
    content: function content() {
      // Any content that can be loaded and passes through the format testing is a valid on-demand file.
      return true;
    } // content

  };
  var line2dFile = /*#__PURE__*/function (_onDemandFile) {
    _inherits(line2dFile, _onDemandFile);

    var _super3 = _createSuper(line2dFile);

    function line2dFile() {
      _classCallCheck(this, line2dFile);

      return _super3.apply(this, arguments);
    }

    _createClass(line2dFile, [{
      key: "format",
      value: // Can a method be both static and 
      function format(obj) {
        obj.content = dbsliceFile.test.structure(line2dFile, obj.content);
        return obj;
      } // format
      // Structure should be testable outside as well, as it will have to be called bt onDemandDataFile when its trying to classify the files.
      // test

    }]);

    return line2dFile;
  }(onDemandFile); // line2dFile

  line2dFile.structure = {
    csv2lineFile: function csv2lineFile(content) {
      if (Array.isArray(content)) {
        var content_ = {
          variables: content.columns,
          data: dbsliceFile.convertNumbers(content)
        }; // Test the new contents.

        line2dFile.test.content(content_); // Structure test succeeded. Delete the columns that accompany the array object.

        delete content_.data.columns;
        return content_;
      } else {
        return undefined;
      } // if

    },
    // array
    json2lineFile: function json2lineFile(content) {
      if (Array.isArray(content.data)) {
        var content_ = {
          variables: Object.getOwnPropertyNames(content.data[0]),
          data: content.data
        }; // Test the new contents.

        line2dFile.test.content(content_);
        return content_;
      } else {
        return undefined;
      } // if

    } // object

  };
  line2dFile.test = {
    content: function content(_content2) {
      if (_content2.variables.length < 2) {
        throw new Error("InvalidFile: No variable pair detected");
      } // if
      // All values MUST be numeric!


      var testrow = dbsliceFile.testrow(_content2.data);
      var areAllContentsNumeric = Object.getOwnPropertyNames(testrow.row).every(function (varName) {
        var value = testrow.row[varName];
        return typeof value === 'number' && isFinite(value);
      });

      if (!areAllContentsNumeric) {
        // There are non-numeric values in the data.
        throw new Error("InvalidFile: Some variables include non-numeric values.");
      } // if


      return true;
    } // content

  };
  var contour2dFile = /*#__PURE__*/function (_onDemandFile2) {
    _inherits(contour2dFile, _onDemandFile2);

    var _super4 = _createSuper(contour2dFile);

    function contour2dFile() {
      _classCallCheck(this, contour2dFile);

      return _super4.apply(this, arguments);
    }

    _createClass(contour2dFile, [{
      key: "format",
      value: function format(obj) {
        obj.content = dbsliceFile.test.structure(contour2dFile, obj.content);
        return obj;
      } // format
      // test

    }]);

    return contour2dFile;
  }(onDemandFile); // contour2dFile
  // Support for files that are allowed to be dragged and dropped - session files, metadata files.

  contour2dFile.structure = {
    // This can now more easily handle different ways of specifying contours. Also convenient to implement the data structure conversion here, e.g. from points to triangles.
    json2contour2dFile: function json2contour2dFile(content) {
      // Allow it to be an array - this facilitates plotting domains with holes in them. But also keep support in case it is a single one - to accomodate legacy data.
      var surfaces = Array.isArray(content.surfaces) ? content.surfaces : [content.surfaces]; // First perform a mapping?? And then test??

      surfaces = surfaces.map(function (surface) {
        return {
          variables: Object.getOwnPropertyNames(surface),
          data: surface
        };
      }); // map

      surfaces = surfaces.filter(contour2dFile.test.surface);

      if (surfaces.length < 1) {
        throw new Error("InvalidFile: Unsupported data structure");
      } // if	


      return surfaces;
    } // object

  };
  contour2dFile.test = {
    surface: function surface(_surface) {
      // In the content I expect an array called `y', `x', `v' (or others), and `size'. The first three must all be the same length, and the last one must have 2 numbers.
      var d = _surface.data;
      var L = d.x.length == d.y.length && d.x.length > 3 && d.size.length == 2 ? d.x.length : undefined; // Find all possible variables. The variables are deemed available if they are the same length as the x and y arrays. Also, they must contain only numeric values.
      _surface.variables = _surface.variables.filter(function (varname) {
        return contour2dFile.test.variable(d, varname);
      });
      return _surface.variables.length > 0;
    },
    // surface
    variable: function variable(data, varname) {
      // Find all possible variables. The variables are deemed available if they are the same length as the x and y arrays. Also, they must contain only numeric values.
      var compulsory = ["x", "y", "size"];
      var vals = data[varname];
      var L_ = undefined;

      if (!compulsory.includes(varname) && Array.isArray(vals) && !vals.some(isNaN)) {
        // The variable is a possible user variable if it is not one of the compulsory variables, if it is an array, and if all it's values are numeric.
        L_ = vals.length;
      } // if
      // The particular variable has to be an array of exactly the same length as `x' and `y'.


      return L_ == data.x.length;
    } // variable

  };
  var userFile$1 = /*#__PURE__*/function (_dbsliceFile3) {
    _inherits(userFile, _dbsliceFile3);

    var _super5 = _createSuper(userFile);

    function userFile() {
      _classCallCheck(this, userFile);

      return _super5.apply(this, arguments);
    }

    _createClass(userFile, [{
      key: "onload",
      value: function onload(obj) {
        // Mutate onload.
        var mutatedobj;

        switch (obj.content.format) {
          case "metadataFile":
            // Not easy to mutate, as the format of the content may not be correct.
            mutatedobj = new metadataFile$1(obj);
            mutatedobj.content = obj.content;
            mutatedobj.promise = obj.promise; // Also need to classify...

            mutatedobj = mutatedobj.classify.all(mutatedobj);
            break;

          case "sessionFile":
            // Return the contents as they are.
            mutatedobj = new sessionFile(obj);
            mutatedobj.content = obj.content;
            mutatedobj.promise = obj.promise;
            break;
        } // switch


        return mutatedobj;
      } // onload

    }, {
      key: "format",
      value: function format(obj) {
        // Here try all different ways to format the data. If the formatting succeeds, then check if the contents are fine.
        // SHOULD ALSO ACCEPT SESSION FILES.
        var availableFileClasses = [metadataFile$1, sessionFile]; // Here just try to fit the data into all hte supported data formats, and see what works.

        var content_;
        availableFileClasses.every(function (fileClass) {
          try {
            // The structure test will throw an error if the content cannot be handled correctly.
            content_ = dbsliceFile.test.structure(fileClass, obj.content); // This file class can handle the data.

            content_.format = fileClass.name;
          } catch (_unused3) {
            return true;
          } // if

        }); // Output the object, but add it's format to the name.

        if (content_.format) {
          obj.content = content_;
          return obj;
        } else {
          throw new Error("InvalidFile: Unsupported data structure");
        } // if

      } // format

    }, {
      key: "mutateToMetadata",
      value: // test
      function mutateToMetadata(obj) {
        var mutatedobj = new metadataFile$1(obj); // Refactor the 
      } // mutateToMetadata

    }]);

    return userFile;
  }(dbsliceFile); // userFile
  // This one is capable of loading in just about anything, but it's also not getting stored internally.

  userFile$1.test = {
    content: function content() {
      // Any content that can be loaded and passes through the format testing is a valid on-demand file.
      return true;
    } // content

  };
  var sessionFile = /*#__PURE__*/function (_userFile) {
    _inherits(sessionFile, _userFile);

    var _super6 = _createSuper(sessionFile);

    function sessionFile() {
      _classCallCheck(this, sessionFile);

      return _super6.apply(this, arguments);
    }

    _createClass(sessionFile, [{
      key: "format",
      value: function format(obj) {
        obj.content = dbsliceFile.test.structure(sessionFile, obj.content);
        return obj;
      } // format
      // test

    }]);

    return sessionFile;
  }(userFile$1); // sessionFile
  // Category info.

  sessionFile.structure = {
    // This can now more easily handle different ways of specifying contours. Also convenient to implement the data structure conversion here, e.g. from points to triangles.
    json2sessionFile: function json2sessionFile(content) {
      // Has to be an object, whose entries are valid categories. The entries of the categories are considered the variables after teh merge. Each of them must have the same exact properties (file names), the names must include all the already loaded files, and all the file variables must be present in those files. 
      // Expect two parts to hte file: the merging and session info.
      // What happens when there is no sessionInfo, or nop merging info? Shouldn't it just throw an error??
      // Prune away anything that is not in line with the expected structure. Using map creates an array, but it should instead remain an object!!
      var mergingInfo = categoryInfo.supportedCategories.reduce(function (dict, category) {
        dict[category] = content.mergingInfo[category];
        return dict;
      }, {}); // map
      // There are some attributes that the sessionInfo section must have:
      // title, plotRows.

      var sessionInfo = content.sessionInfo;

      if (!helpers.arrayIncludesAll(Object.getOwnPropertyNames(sessionInfo), ["title", "plotRows"])) {
        throw new Error("InvalidFile: Session title or rows not specified.");
      } // if


      return {
        merging: mergingInfo,
        session: sessionInfo
      };
    } // object

  };
  sessionFile.test = {
    content: function content(_content3) {
      // The philosophy here is that if it can be applied it is valid.
      // Try to use it and see if it'll be fine.
      var fileobjs = dbsliceDataCreation.makeInternalData(fileManager.library.retrieve(metadataFile$1));
      fileobjs = dbsliceDataCreation.sortByLoadedMergingInfo(fileobjs, _content3); // No need to check if all the loaded files were declared for - just use the merge to do what is possible.
      // Maybe the same applies to variables too? Just use what you can?
      // Maybe I don't even need to find common file names??
      // If there's no metadata files loaded then assume they're metadata files.
      // At least some of the 

      return true;
    } // content

  };
  var categoryInfo = {
    catCompatibleTypes: {
      categorical: ["number", "string", "line2dFile", "contour2dFile"],
      ordinal: ["number"],
      line2dFile: ["line2dFile"],
      contour2dFile: ["contour2dFile"]
    },
    // catCompatibleTypes
    cat2type: {
      categorical: "string",
      ordinal: "number",
      line2dFile: "line2dFile",
      contour2dFile: "contour2dFile"
    },
    // cat2type
    cat2ind: {
      categorical: 0,
      ordinal: 1,
      line2dFile: 2,
      contour2dFile: 3,
      unused: 4
    },
    // cat2ind
    cat2prop: {
      categorical: "categoricalProperties",
      ordinal: "ordinalProperties",
      line2dFile: "line2dProperties",
      contour2dFile: "contour2dProperties",
      unused: "unusedProperties"
    },
    // cat2prop
    ind2cat: {
      0: "categorical",
      1: "ordinal",
      2: "line2dFile",
      3: "contour2dFile",
      4: "unused"
    },
    // ind2cat
    // Move to input testing
    supportedCategories: ["categorical", "ordinal", "line2dFile", "contour2dFile", "Unused"] // supportedCategories

  }; // categoryInfo

  // `dbsliceData' is the object that contains all the loaded metadata, the loaded on-demand files, and all crossfilter functionality that allows interactive filtering. It can perform all the updates to the metadata that may be initiated by the user.
  var dbsliceData = {
    // Some properties.
    metadata: {
      categoricalProperties: [],
      ordinalProperties: [],
      line2dProperties: [],
      contour2dProperties: [],
      categoricalUniqueValues: [],
      histogramRanges: [],
      crossfilter: undefined
    },
    files: [],
    merging: {},
    // Functionality for metadata - flatten!
    internal: {
      cfData: {
        initialise: function initialise() {
          // Adds the crossfilter, it's dimensions, and any associated helper arrays to dbsliceData, if that is necessary.
          var cfData = {
            cf: crossfilter([]),
            categoricalDims: [],
            ordinalDims: [],
            taskDim: undefined,
            fileDim: undefined,
            filterSelected: [],
            histogramSelectedRanges: [],
            manuallySelectedTasks: []
          }; // cfData

          cfData.fileDim = cfData.cf.dimension(function (d) {
            return d.filenameId;
          });
          cfData.taskDim = cfData.cf.dimension(function (d) {
            return d.taskId;
          });
          dbsliceData.metadata.crossfilter = cfData;
        },
        // initialise
        change: function change(metadata) {
          // Handle the change to the metadata. Simply exchange all the internal data. But, I may need to retain the filter settings?
          // Exchange the data.
          dbsliceData.metadata.crossfilter.cf.remove();
          dbsliceData.metadata.crossfilter.cf.add(metadata.data); // Resolve the differences between the old variables and the new variables.

          dbsliceData.internal.cfData.resolve.headerChange(metadata.header);
        },
        // change
        // cfdata
        resolve: {
          headerChange: function headerChange(newHeader) {
            var resolve = dbsliceData.internal.cfData.resolve;
            var metadata = dbsliceData.metadata;
            var cf = dbsliceData.metadata.crossfilter; // Go through the new header. The changes require also the crossfilter dimensions to be adjusted.

            Object.keys(newHeader).forEach(function (key) {
              // Find the differences for this category that need to be resolved. 'diff' has items aMinusB (in current, but not in new) and bMinusA ( in new, but not in current)
              var diff = helpers.setDifference(cf[key], newHeader[key]);

              switch (key) {
                case "categoricalProperties":
                  // Metadata dimensions have precomputed unique values.
                  resolve.dimensions(cf.categoricalDims, diff);
                  resolve.uniqueValues(metadata.categoricalUniqueValues, diff);
                  break;

                case "ordinalProperties":
                  // Data dimensions have corresponding histogram ranges.
                  resolve.dimensions(cf.ordinalDims, diff);
                  resolve.histogramRanges(metadata.histogramRanges, diff);
                  break;
              } // switch
              // Resolve the property arrays themselves.


              metadata[key] = newHeader[key];
            }); // forEach
          },
          // headerChange
          dimensions: function dimensions(dims, diff) {
            // Those in A, but not in B, must have their cf dimensions removed.
            diff.aMinusB.forEach(function (varName) {
              delete dims[varName];
            }); // Those in B, but not in A, must have cf dimensions created.

            diff.bMinusA.forEach(function (varName) {
              var newDim = dbsliceData.metadata.crossfilter.cf.dimension(function (d) {
                return d[varName];
              });
              dims[varName] = newDim;
            });
          },
          // dimensions
          uniqueValues: function uniqueValues(vals, diff) {
            dbsliceData.internal.cfData.resolve.attributes(vals, diff, function (varName) {
              // Find all the unique values for a particular variable.
              return helpers.unique(dbsliceData.metadata.crossfilter.cf.all().map(function (d) {
                return d[varName];
              }));
            });
          },
          // uniqueValues
          histogramRanges: function histogramRanges(vals, diff) {
            dbsliceData.internal.cfData.resolve.attributes(vals, diff, function (varName) {
              // Find the max range for the histogram.
              var tasks = dbsliceData.metadata.crossfilter.cf.all();
              return d3.extent(tasks, function (d) {
                return d[varName];
              });
            });
          },
          // histogramRanges
          attributes: function attributes(vals, diff, populate) {
            // Vals is an object of attributes that  needs to be resolved. The resolution of the attributes is given by diff. Populate is a function that states how that attribute should be populated if it's being created.
            // Delete
            diff.aMinusB.forEach(function (varName) {
              delete vals[varName];
            }); // Variables that are in 'new', but not in 'old'.

            diff.bMinusA.forEach(function (varName) {
              // If a populate function is defined, then create an entry, otherwise create an empty one.
              if (populate) {
                vals[varName] = populate(varName);
              } else {
                vals[varName] = [];
              } // if

            });
          } // attributes

        } // cfData

      } // cf

    },
    // metadata
    // Handling of on-demand files.
    importing: {
      // PROMPT SHOULD BE MOVED!!
      prompt: function prompt(requestPromises) {
        // Only open the prompt if any of the requested files were metadata files!
        Promise.allSettled(requestPromises).then(function (loadresults) {
          if (loadresults.some(function (res) {
            return res.value instanceof metadataFile;
          })) {
            var allMetadataFiles = dbsliceData.library.retrieve(metadataFile); // PROMPT THE USER

            if (allMetadataFiles.length > 0) {
              // Prompt the user to handle the categorication and merging.
              // Make the variable handling
              dbsliceDataCreation.make();
              dbsliceDataCreation.show();
            } else {
              // If there is no files the user should be alerted. This should use the reporting to tell the user why not.
              alert("None of the selected files were usable.");
            } // if

          } // if

        }); // then
      },
      // prompt
      dragdropped: function dragdropped(files) {
        // In the beginning only allow the user to load in metadata files.
        var requestPromises;
        var allMetadataFiles = dbsliceData.library.retrieve(metadataFile);

        if (allMetadataFiles.length > 0) {
          // Load in as userFiles, mutate to appropriate file type, and then push forward.
          requestPromises = dbsliceData.importing.batch(userFile, files);
        } else {
          // Load in as metadata.
          requestPromises = dbsliceData.importing.batch(metadataFile, files);
        } // if


        dbsliceData.importing.prompt(requestPromises);
      },
      // dragdropped
      single: function single(classref, file) {
        // Construct the appropriate file object.
        var fileobj = new classref(file); // Check if this file already exists loaded in.

        var libraryEntry = dbsliceData.library.retrieve(undefined, fileobj.filename);

        if (libraryEntry) {
          fileobj = libraryEntry;
        } else {
          // Initiate loading straight away
          fileobj.load(); // After loading if the file has loaded correctly it has some content and can be added to internal storage.

          dbsliceData.library.store(fileobj);
        } // if
        // The files are only stored internally after they are loaded, therefore a reference must be maintained to the file loaders here.


        return fileobj.promise;
      },
      // single
      batch: function batch(classref, files) {
        // This is in fact an abstract loader for any set of files given by 'files' that are all of a file class 'classref'.
        var requestPromises = files.map(function (file) {
          return dbsliceData.importing.single(classref, file);
        });
        return requestPromises;
      } // batch

    },
    // importing
    library: {
      update: function update(urlsToKeep) {
        // Actually, just allow the plots to issue orders on hteir own. The library update only removes files that are not explicitly needed.				
        var filesForRemoval = dbsliceData.files.filter(function (file) {
          // This should only remove on-demand files though - don't let it remove metadata or sessionFiles. All on-demand files are a subclass of 'onDemandFile'.
          var flag = false;

          if (file instanceof onDemandFile) {
            flag = !urlsToKeep.includes(file.url);
          } // if


          return flag;
        }); // filter

        filesForRemoval.forEach(function (file) {
          var i = dbsliceData.files.indexOf(file);
          dbsliceData.files.splice(i, 1);
        }); // forEach
      },
      // update
      store: function store(fileobj) {
        fileobj.promise.then(function (obj_) {
          if (obj_ instanceof sessionFile) {
            // Session files should not be stored internally! If the user loads in another session file it should be applied directly, and not in concert with some other session files.
            sessionManager.onSessionFileLoad(obj_);
          } else {
            // Other files should be stored if they have any content.
            if (obj_.content) {
              dbsliceData.files.push(fileobj);
            } // if

          } // if

        });
      },
      // store
      retrieve: function retrieve(classref, filename) {
        // If filename is defined, then try to return that file. Otherwise return all.
        var files;

        if (filename) {
          files = dbsliceData.files.filter(function (file) {
            return file.filename == filename;
          }); // filter

          files = files[0];
        } else {
          files = dbsliceData.files.filter(function (file) {
            return file instanceof classref;
          }); // filter
        } // if


        return files;
      },
      // retrieve
      remove: function remove(classref, filename) {
        // First get the reference to all hte files to be removed.
        var filesForRemoval = dbsliceData.library.retrieve(classref, filename); // For each of these find it's index, and splice it.

        filesForRemoval.forEach(function (file) {
          var i = dbsliceData.files.indexOf(file);
          dbsliceData.files.splice(i, 1);
        });
      } // remove

    },
    // library
    // Move to session manager
    exporting: {
      session: {
        download: function download() {
          // Make a blob from a json description of the session.
          var b = dbsliceData.exporting.session.makeTextFile(sessionManager.write()); // Download the file.

          var lnk = document.createElement("a");
          lnk.setAttribute("download", "test_session.json");
          lnk.setAttribute("href", b);
          var m = d3.select(document.getElementById("sessionOptions").parentElement).select(".dropdown-menu").node();
          m.appendChild(lnk);
          lnk.click();
        },
        // download
        makeTextFile: function makeTextFile(text) {
          var data = new Blob([text], {
            type: 'text/plain'
          });
          var textFile = null; // If we are replacing a previously generated file we need to
          // manually revoke the object URL to avoid memory leaks.

          if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
          } // if


          textFile = window.URL.createObjectURL(data);
          return textFile;
        } // makeTextFile

      } // session

    } // exporting

  }; // dbsliceData

  // utility function
  var assert = function assert(condition, message) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  }; // syntax sugar


  var getopt = function getopt(opt, field, defaultval) {
    if (opt.hasOwnProperty(field)) {
      return opt[field];
    } else {
      return defaultval;
    }
  }; // return 0 mean unit standard deviation random number


  var return_v = false;
  var v_val = 0.0;

  var gaussRandom = function gaussRandom() {
    if (return_v) {
      return_v = false;
      return v_val;
    }

    var u = 2 * Math.random() - 1;
    var v = 2 * Math.random() - 1;
    var r = u * u + v * v;
    if (r == 0 || r > 1) return gaussRandom();
    var c = Math.sqrt(-2 * Math.log(r) / r);
    v_val = v * c; // cache this for next function call for efficiency

    return_v = true;
    return u * c;
  }; // return random normal number


  var randn = function randn(mu, std) {
    return mu + gaussRandom() * std;
  }; // utilitity that creates contiguous vector of zeros of size n


  var zeros = function zeros(n) {
    if (typeof n === 'undefined' || isNaN(n)) {
      return [];
    }

    if (typeof ArrayBuffer === 'undefined') {
      // lacking browser support
      var arr = new Array(n);

      for (var i = 0; i < n; i++) {
        arr[i] = 0;
      }

      return arr;
    } else {
      return new Float64Array(n); // typed arrays are faster
    }
  }; // utility that returns 2d array filled with random numbers
  // or with value s, if provided


  var randn2d = function randn2d(n, d, s) {
    var uses = typeof s !== 'undefined';
    var x = [];

    for (var i = 0; i < n; i++) {
      var xhere = [];

      for (var j = 0; j < d; j++) {
        if (uses) {
          xhere.push(s);
        } else {
          xhere.push(randn(0.0, 1e-4));
        }
      }

      x.push(xhere);
    }

    return x;
  }; // compute L2 distance between two vectors


  var L2 = function L2(x1, x2) {
    var D = x1.length;
    var d = 0;

    for (var i = 0; i < D; i++) {
      var x1i = x1[i];
      var x2i = x2[i];
      d += (x1i - x2i) * (x1i - x2i);
    }

    return d;
  }; // compute pairwise distance in all vectors in X


  var xtod = function xtod(X) {
    var N = X.length;
    var dist = zeros(N * N); // allocate contiguous array

    for (var i = 0; i < N; i++) {
      for (var j = i + 1; j < N; j++) {
        var d = L2(X[i], X[j]);
        dist[i * N + j] = d;
        dist[j * N + i] = d;
      }
    }

    return dist;
  }; // compute (p_{i|j} + p_{j|i})/(2n)


  var d2p = function d2p(D, perplexity, tol) {
    var Nf = Math.sqrt(D.length); // this better be an integer

    var N = Math.floor(Nf);
    assert(N === Nf, "D should have square number of elements.");
    var Htarget = Math.log(perplexity); // target entropy of distribution

    var P = zeros(N * N); // temporary probability matrix

    var prow = zeros(N); // a temporary storage compartment

    for (var i = 0; i < N; i++) {
      var betamin = -Infinity;
      var betamax = Infinity;
      var beta = 1; // initial value of precision

      var done = false;
      var maxtries = 50; // perform binary search to find a suitable precision beta
      // so that the entropy of the distribution is appropriate

      var num = 0;

      while (!done) {
        //debugger;
        // compute entropy and kernel row with beta precision
        var psum = 0.0;

        for (var j = 0; j < N; j++) {
          var pj = Math.exp(-D[i * N + j] * beta);

          if (i === j) {
            pj = 0;
          } // we dont care about diagonals


          prow[j] = pj;
          psum += pj;
        } // normalize p and compute entropy


        var Hhere = 0.0;

        for (var j = 0; j < N; j++) {
          if (psum == 0) {
            var pj = 0;
          } else {
            var pj = prow[j] / psum;
          }

          prow[j] = pj;
          if (pj > 1e-7) Hhere -= pj * Math.log(pj);
        } // adjust beta based on result


        if (Hhere > Htarget) {
          // entropy was too high (distribution too diffuse)
          // so we need to increase the precision for more peaky distribution
          betamin = beta; // move up the bounds

          if (betamax === Infinity) {
            beta = beta * 2;
          } else {
            beta = (beta + betamax) / 2;
          }
        } else {
          // converse case. make distrubtion less peaky
          betamax = beta;

          if (betamin === -Infinity) {
            beta = beta / 2;
          } else {
            beta = (beta + betamin) / 2;
          }
        } // stopping conditions: too many tries or got a good precision


        num++;

        if (Math.abs(Hhere - Htarget) < tol) {
          done = true;
        }

        if (num >= maxtries) {
          done = true;
        }
      } // console.log('data point ' + i + ' gets precision ' + beta + ' after ' + num + ' binary search steps.');
      // copy over the final prow to P at row i


      for (var j = 0; j < N; j++) {
        P[i * N + j] = prow[j];
      }
    } // end loop over examples i
    // symmetrize P and normalize it to sum to 1 over all ij


    var Pout = zeros(N * N);
    var N2 = N * 2;

    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        Pout[i * N + j] = Math.max((P[i * N + j] + P[j * N + i]) / N2, 1e-100);
      }
    }

    return Pout;
  }; // helper function


  function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  } // CONVERT TO CLASS


  var tSNE = /*#__PURE__*/function () {
    function tSNE(opt) {
      _classCallCheck(this, tSNE);

      var opt = opt || {};
      this.perplexity = getopt(opt, "perplexity", 30); // effective number of nearest neighbors

      this.dim = getopt(opt, "dim", 2); // by default 2-D tSNE

      this.epsilon = getopt(opt, "epsilon", 10); // learning rate

      this.iter = 0;
    } // constructor
    // this function takes a set of high-dimensional points
    // and creates matrix P from them using gaussian kernel


    _createClass(tSNE, [{
      key: "initDataRaw",
      value: function initDataRaw(X) {
        var N = X.length;
        var D = X[0].length;
        assert(N > 0, " X is empty? You must have some data!");
        assert(D > 0, " X[0] is empty? Where is the data?");
        var dists = xtod(X); // convert X to distances using gaussian kernel

        this.P = d2p(dists, this.perplexity, 1e-4); // attach to object

        this.N = N; // back up the size of the dataset

        this.initSolution(); // refresh this
      } // initDataRaw
      // this function takes a given distance matrix and creates
      // matrix P from them.
      // D is assumed to be provided as a list of lists, and should be symmetric

    }, {
      key: "initDataDist",
      value: function initDataDist(D) {
        var N = D.length;
        assert(N > 0, " X is empty? You must have some data!"); // convert D to a (fast) typed array version

        var dists = zeros(N * N); // allocate contiguous array

        for (var i = 0; i < N; i++) {
          for (var j = i + 1; j < N; j++) {
            var d = D[i][j];
            dists[i * N + j] = d;
            dists[j * N + i] = d;
          }
        }

        this.P = d2p(dists, this.perplexity, 1e-4);
        this.N = N;
        this.initSolution(); // refresh this
      } // initDataDist
      // (re)initializes the solution to random

    }, {
      key: "initSolution",
      value: function initSolution() {
        // generate random solution to t-SNE
        this.Y = randn2d(this.N, this.dim); // the solution

        this.gains = randn2d(this.N, this.dim, 1.0); // step gains to accelerate progress in unchanging directions

        this.ystep = randn2d(this.N, this.dim, 0.0); // momentum accumulator

        this.iter = 0;
      } // initSolution
      // return pointer to current solution

    }, {
      key: "getSolution",
      value: function getSolution() {
        return this.Y;
      } // getSolution
      // perform a single step of optimization to improve the embedding

    }, {
      key: "step",
      value: function step() {
        this.iter += 1;
        var N = this.N;
        var cg = this.costGrad(this.Y); // evaluate gradient

        var cost = cg.cost;
        var grad = cg.grad; // perform gradient step

        var ymean = zeros(this.dim);

        for (var i = 0; i < N; i++) {
          for (var d = 0; d < this.dim; d++) {
            var gid = grad[i][d];
            var sid = this.ystep[i][d];
            var gainid = this.gains[i][d]; // compute gain update

            var newgain = sign(gid) === sign(sid) ? gainid * 0.8 : gainid + 0.2;
            if (newgain < 0.01) newgain = 0.01; // clamp

            this.gains[i][d] = newgain; // store for next turn
            // compute momentum step direction

            var momval = this.iter < 250 ? 0.5 : 0.8;
            var newsid = momval * sid - this.epsilon * newgain * grad[i][d];
            this.ystep[i][d] = newsid; // remember the step we took
            // step!

            this.Y[i][d] += newsid;
            ymean[d] += this.Y[i][d]; // accumulate mean so that we can center later
          } // for

        } // for
        // reproject Y to be zero mean


        for (var i = 0; i < N; i++) {
          for (var d = 0; d < this.dim; d++) {
            this.Y[i][d] -= ymean[d] / N;
          }
        } //if(this.iter%100===0) console.log('iter ' + this.iter + ', cost: ' + cost);


        return cost; // return current cost
      } // step
      // for debugging: gradient check

    }, {
      key: "debugGrad",
      value: function debugGrad() {
        var N = this.N;
        var cg = this.costGrad(this.Y); // evaluate gradient

        var cost = cg.cost;
        var grad = cg.grad;
        var e = 1e-5;

        for (var i = 0; i < N; i++) {
          for (var d = 0; d < this.dim; d++) {
            var yold = this.Y[i][d];
            this.Y[i][d] = yold + e;
            var cg0 = this.costGrad(this.Y);
            this.Y[i][d] = yold - e;
            var cg1 = this.costGrad(this.Y);
            var analytic = grad[i][d];
            var numerical = (cg0.cost - cg1.cost) / (2 * e);
            console.log(i + ',' + d + ': gradcheck analytic: ' + analytic + ' vs. numerical: ' + numerical);
            this.Y[i][d] = yold;
          }
        }
      } // debugGrad
      // return cost and gradient, given an arrangement

    }, {
      key: "costGrad",
      value: function costGrad(Y) {
        var N = this.N;
        var dim = this.dim; // dim of output space

        var P = this.P;
        var pmul = this.iter < 100 ? 4 : 1; // trick that helps with local optima
        // compute current Q distribution, unnormalized first

        var Qu = zeros(N * N);
        var qsum = 0.0;

        for (var i = 0; i < N; i++) {
          for (var j = i + 1; j < N; j++) {
            var dsum = 0.0;

            for (var d = 0; d < dim; d++) {
              var dhere = Y[i][d] - Y[j][d];
              dsum += dhere * dhere;
            }

            var qu = 1.0 / (1.0 + dsum); // Student t-distribution

            Qu[i * N + j] = qu;
            Qu[j * N + i] = qu;
            qsum += 2 * qu;
          }
        } // normalize Q distribution to sum to 1


        var NN = N * N;
        var Q = zeros(NN);

        for (var q = 0; q < NN; q++) {
          Q[q] = Math.max(Qu[q] / qsum, 1e-100);
        }

        var cost = 0.0;
        var grad = [];

        for (var i = 0; i < N; i++) {
          var gsum = new Array(dim); // init grad for point i

          for (var d = 0; d < dim; d++) {
            gsum[d] = 0.0;
          }

          for (var j = 0; j < N; j++) {
            cost += -P[i * N + j] * Math.log(Q[i * N + j]); // accumulate cost (the non-constant portion at least...)

            var premult = 4 * (pmul * P[i * N + j] - Q[i * N + j]) * Qu[i * N + j];

            for (var d = 0; d < dim; d++) {
              gsum[d] += premult * (Y[i][d] - Y[j][d]);
            }
          }

          grad.push(gsum);
        }

        return {
          cost: cost,
          grad: grad
        };
      } // costGrad

    }]);

    return tSNE;
  }(); // tSNE

  /*
  kmeans_dev: the groups are determined as points on the screen. Therefore on group initialisation first points must be assigned based on their on-screen position.

  kmeans: the groups are built by the user. The on-screen positions are not required anymore.

  */
  var kgroup = /*#__PURE__*/function () {
    function kgroup(refobj, pos) {
      _classCallCheck(this, kgroup);

      this.refobj = refobj;
      this.pos = pos;
      this.previous = [];
      this.members = [];
      this.changed = true;
      this.id = 0;
    } // constructor


    _createClass(kgroup, [{
      key: "average",
      value: function average(accessor) {
        var obj = this;
        var n = obj.members.length;
        return obj.members.reduce(function (acc, member) {
          var vals = accessor(member);

          if (acc) {
            acc = acc.map(function (v, i) {
              return v + vals[i] / n;
            });
          } else {
            acc = vals.map(function (v) {
              return v / n;
            });
          } // if


          return acc;
        }, undefined); // reduce
      } // average

    }, {
      key: "update",
      value: function update() {
        var obj = this;
        obj.cp = obj.average(function (d) {
          return d.cp;
        });
        obj.pos = obj.average(function (d) {
          return d.pos;
        });
      } // update

    }]);

    return kgroup;
  }(); // kgroup

  var kmeans = /*#__PURE__*/function () {
    function kmeans(points) {
      _classCallCheck(this, kmeans);

      // The incoming points can be complicated objects. Wrap them appropriately for internal use. The k-means object will require an accessor to hte on-screen position of the incoming objects, as well as to the array that should be used in the k-means. 
      this.groups = [];
      this.points = points;
      this.i = 0;
    } // constructor


    _createClass(kmeans, [{
      key: "addgroup",
      value: function addgroup(group) {
        var obj = this; // Must have less groups than points!

        if (obj.groups.length < obj.points.length && group instanceof kgroup) {
          // When a new group is added the groups should be reinitialised.
          obj.groups.push(group);
        } // if

      } // addgroup

    }, {
      key: "groupinit",
      value: function groupinit() {
        var obj = this; // Update group ids.

        obj.groups.forEach(function (group, i) {
          group.id = i;
          group.members = obj.points.filter(function (point) {
            return group.refobj.sprites.includes(point.refobj);
          }); // filter
          // Calculate the centroid as well.

          group.cp = group.average(function (d) {
            return d.cp;
          });
        }); // Find unassigned points

        var unassigned = obj.points.filter(function (point) {
          return !obj.groups.some(function (group) {
            return group.members.includes(point);
          });
        }); // filter
        // Distribute the points between the groups. But only those that are not yet assigned!!

        unassigned.forEach(function (point, i) {
          var closest = kmeans.findclosestgroup(point, obj.groups, function (d) {
            return d.cp;
          });
          closest.group.members.push(point);
          point.groupid = closest.group.id;
        }); // FORCE THE GROUPS TO HAVE MEMBERS!!

        obj.groups.forEach(function (group) {
          if (group.members.length < 1) {
            // Find the group with the maximum amount of points.
            var largest = obj.groups.reduce(function (acc, group) {
              return acc.members.length > group.members.length ? acc : group;
            }, {
              members: []
            }); // reduce

            var donated = largest.members.splice(0, 1)[0];
            group.members.push(donated);
            donated.groupid = group.id;
          } // if

        });
      } // groupinit

    }, {
      key: "clear",
      value: function clear() {
        var obj = this;
        obj.groups = [];
      } // clear

    }, {
      key: "cluster",
      value: function cluster() {
        var obj = this;
        obj.groupinit();

        if (obj.groups.length > 1) {
          // Calculate the centroids.
          obj.i = 0;

          while (obj.groups.some(function (group) {
            return group.changed;
          })) {
            var t0 = performance.now();
            obj.step();
            var t1 = performance.now();
            console.log("step:", obj.i, " dt: ", t1 - t0, "ms");

            if (obj.i > 5) {
              console.log("Iteration limit exceeded");
              break;
            } // if

          } // while

        } // if

      } // cluster

    }, {
      key: "step",
      value: function step() {
        var obj = this; // Recalculate centroids, purge the membership, but keep a log.

        obj.groups.forEach(function (group) {
          group.update();
          group.previous = group.members;
          group.members = [];
        }); // forEach
        // Redistribute sprites

        obj.points.forEach(function (point) {
          // Find the closest group.
          var closest = kmeans.findclosestgroup(point, obj.groups, function (d) {
            return d.cp;
          });
          closest.group.members.push(point);
          point.groupid = closest.group.id;
        }); // forEach
        // Check if there is a difference between the previous and current group membership.

        obj.groups.forEach(function (group) {
          var isMembershipSame = aContainsB(group.previous, group.members) && aContainsB(group.members, group.previous);
          group.changed = !isMembershipSame;
        }); // forEach

        obj.i += 1;
      } // step

    }], [{
      key: "findclosestgroup",
      value: function findclosestgroup(point, groups, accessor) {
        return groups.reduce(function (current, group) {
          var dist = kmeans.euclidean(accessor(group), accessor(point));

          if (dist < current.dist) {
            current.group = group;
            current.dist = dist;
          } // if


          return current;
        }, {
          group: undefined,
          dist: Number.POSITIVE_INFINITY
        });
      } // findclosestgroup

    }, {
      key: "euclidean",
      value: function euclidean(centroid, sprite) {
        // centroid and the sprite should already be the data: `spriteobj.file.content[0].data.Cp'. They are n-dimensional vectors of the same length.
        var s = 0;

        for (var i = 0; i < centroid.length; i++) {
          s += Math.pow(centroid[i] - sprite[i], 2);
        } // for
        // Note that s is not square-rooted. Since we're just comparing the distances it doesn't need to be.


        return s;
      } // euclidean

    }]);

    return kmeans;
  }(); // kmeans

  function aContainsB(A, B) {
    // A.some(...) => is any element of A not present in B?
    // Returns true if some elements are missing, and false if not. Therefore !A.some(...) => are all elements of A in B?
    return !A.some(function (a) {
      // !B.includes(a) => is B missing a?
      return !B.includes(a);
    });
  } // aContainsB

  /* CLUSTERING INTERFACE

  A decision has to be made for the k-means grouping algorithm interface. The k-means algorithm requires 3 inputs: number of groups, initial centroids for the groups, and the distance metric. The distance metric has to be hard-coded, for large sprite data the centroids cannot be given through direct interactivity, but the number of groups can be set interactively. For smooth interactivity the centroids must be deduced from the number of groups. Options are:
  	1.) Piles. The user creates piles as seen in piling.js. The piles that are on-screen are the initial groups. The piles already have some members, which can be used to calculate the centroids. The output is groups with all the on-screen sprites assigned to groups, and the results should be visualised. There are several visualisation options available.
  		i. Groups and sprites are both kept. Border color denotes which groups each sprite belongs to. However, what happens if during the clustering all the initial members of a group are assigned out of this group? The groups will require at least one member, as it will need to show some sprite. The lasso toll can be used to combine them all together.
  		ii. Only groups are kept. All the sprites are encompassed by the groups. A potential disadvantage is that the sprites are automatically piled, and the mean and standard deviation plots would have to be used to assess if the groups make sense. Another disadvantage is that the interface will look a lot like piling.js. 
  		iii. Only sprites are kept. The groups are dissolved, and the sprites have their borders colored. A disadvantage is that the groups disappear. However, an advantage is that the user is prompted to inspect the actual data before piling the data. An additional advantage is that the piles play a lesser role. Completely ungroup the groups within the groups?
  	2.) Points. Instead of making the piles, the user can click on the screen to initialise the group, and increase the number of groups by 1. A dictinct disadvantage is that a specific group marker must be introduced to show the user where they have positioned the group. Additionally, after the marker is placed, the centroids can only be deduced based on the on-screen position of the marker, and the sprites. The only reasonable option to show the results is to highlight the borders of the individual sprites.

  Groups are not colored in as tehy can contain members of different clusters. When the major groups are ungrouped they will just appear without a border.

  */
  // A class that will control the canvas and teh link between the DOM coordinates and data values.

  var canvasobj = /*#__PURE__*/function () {
    function canvasobj(canvas, v2p) {
      _classCallCheck(this, canvasobj);

      this.canvas = canvas;
      this.spritewidth = canvasobj.spritewidth;
      this.scales = {
        x: d3.scaleLinear().domain([0, canvas.width * v2p]).range([0, canvas.width]),
        y: d3.scaleLinear().domain([0, canvas.height * v2p]).range([0, canvas.height])
      }; // scales

      this.current = {
        x: [0, canvas.width * v2p],
        y: [0, canvas.height * v2p],
        v2p: v2p
      }; // current
    } // constructor


    _createClass(canvasobj, [{
      key: "transform",
      value: function transform() {
        // d3/event.transform keeps track of the zoom based on the initial state. Therefore if the scale domain is actually changed, the changes compound later on!! Either reset the event tracker, or keep the domain unchanged, and just update separate view coordinates.
        var view = this.current;
        view.x = d3.event.transform.rescaleX(this.scales.x).domain();
        view.y = d3.event.transform.rescaleY(this.scales.y).domain();
        var v2p_new = (view.x[1] - view.x[0]) / this.canvas.width;
        var k = v2p_new / view.v2p;
        view.v2p = v2p_new;
        this.spritewidth = this.spritewidth / k;
      } // transform

    }, {
      key: "pixel2data",
      value: function pixel2data(pixelpoint) {
        // Transform into the data values. B
        var view = this.current;
        var dom = {
          x: [0, this.canvas.width],
          y: [0, this.canvas.height]
        };
        return canvasobj.domA2domB(pixelpoint, dom, view);
      } // pixel2data

    }, {
      key: "data2pixel",
      value: function data2pixel(datapoint) {
        // Transform into the data values. B
        var view = this.current;
        var dom = {
          x: [0, this.canvas.width],
          y: [0, this.canvas.height]
        };
        return canvasobj.domA2domB(datapoint, view, dom);
      } // pixel2data

    }], [{
      key: "sizeCanvas",
      value: function sizeCanvas(canvas) {
        // The canvas needs to have it's widht and height set internally, otherwise the result is just stretched.
        canvas.width = canvas.getBoundingClientRect().width;
        canvas.height = canvas.getBoundingClientRect().height;
        canvas.style.width = canvas.getBoundingClientRect().width + "px";
        canvas.style.height = canvas.getBoundingClientRect().height + "px";
      } // sizeCanvas

    }, {
      key: "domA2domB",
      value: function domA2domB(point, A, B) {
        // Convert a single point `point' from a domain defined by `A' to a domain defined by `B'. `A' and `B' both require to have `x' and `y' attributes, which are arrays of length 2.
        var x = d3.scaleLinear().domain(A.x).range(B.x);
        var y = d3.scaleLinear().domain(A.y).range(B.y);
        return [x(point[0]), y(point[1])];
      } // dom2view

    }]);

    return canvasobj;
  }(); // canvasobj
  // Internal contour data object. 


  canvasobj.spritewidth = 100;

  var sprite = /*#__PURE__*/function () {
    function sprite(task, parentobj) {
      _classCallCheck(this, sprite);

      // Should have task, file, graphic
      this.task = task;
      this.file = undefined;
      this.graphic = {
        wrapper: undefined,
        position: {}
      }; // graphic

      this.parentobj = parentobj;
      this.positionvalues = undefined; // Create teh DOM element corresponding to this contour, and add it to hte wrapper.

      var wrapper = document.createElement('div');
      wrapper.className = 'list-item';
      wrapper.style.position = "absolute";
      wrapper.style.left = "0px";
      wrapper.style.top = this.parentobj.graphic.canvas.offsetTop + "px";
      var sceneElement = document.createElement('div');
      sceneElement.className = 'scene-element';
      wrapper.appendChild(sceneElement);
      /* Maybe append the name text only on mouseover?
      const descriptionElement = document.createElement( 'div' );
      descriptionElement.className = "description-element";
      descriptionElement.innerText = 'Test scene';
      wrapper.appendChild( descriptionElement );
      */

      parentobj.graphic.container.appendChild(wrapper);
      this.graphic.wrapper = wrapper;
      var d3card = d3.select(wrapper).datum(this);
      var dragobj = new dragCard();
      d3card.call(dragobj.obj);
    } // constructor


    _createClass(sprite, [{
      key: "size",
      value: function size() {
        // Size the window for the sprite appropriately. Note that since the size depends on a single value in the parentobj all the contours are forced to be the same size all the time. Thereforethe user will have to zoom into a contour if they wish to see it up close, and consequently the resizing controls are not necessary!
        var obj = this;
        var domain = obj.parentobj.data.domain;
        var v2p = obj.parentobj.graphic.view.current.v2p;
        var spritewidth = obj.parentobj.graphic.view.spritewidth;
        var spriteheight = (domain.y[1] - domain.y[0]) / v2p;
        d3.select(obj.graphic.wrapper).select("div.scene-element").style("width", spritewidth + "px").style("height", Math.round(spriteheight) + "px");
      } // size

    }, {
      key: "position",
      get: // position
      function get() {
        // Get the DOM position of the contour relative to the canvas.
        var obj = this;
        var wrapper = obj.graphic.wrapper;
        return [parseInt(wrapper.style.left), parseInt(wrapper.style.top)];
      } // position
      ,
      set: function set(point) {
        // Position the DOM wrapper to the coordinates in point.
        this.graphic.wrapper.style.left = point[0] + "px";
        this.graphic.wrapper.style.top = point[1] + "px";
        this.setPositionValues(point);
      }
    }, {
      key: "midpoint",
      get: function get() {
        var obj = this;
        var wrapper = obj.graphic.wrapper;
        return [parseInt(wrapper.style.left) + wrapper.offsetWidth / 2, parseInt(wrapper.style.top) + wrapper.offsetHeight / 2];
      } // midpoint
      // Maybe something about resolving internal position conflict? Consistency. Or just make a getter and setter for positionvalue.

    }, {
      key: "setPositionValues",
      value: function setPositionValues(pos) {
        // Set the position value for easy retrieval later on.
        this.positionvalues = this.parentobj.graphic.view.pixel2data(pos);
      } // setPositionValues
      // Rename reposition and maybe combine it with something??

    }, {
      key: "reposition",
      value: function reposition(point) {
        // Position the DOM wrapper to where the values in `point' are on the canvas.
        var pos = this.parentobj.graphic.view.data2pixel(point);
        this.position = pos;
      } // reposition

    }, {
      key: "translation",
      get: function get() {
        // Maybe this could be moved to the sprite object?
        var obj = this; // Get the correction for the scene location. This also requires the correction for the domain, as well as adjusting the pixel offset by the val2px conversion.
        // obj.graphic.parent is div.content -> plotWrapper

        var scene = obj.graphic.wrapper.getElementsByClassName("scene-element")[0];
        var canvas = obj.parentobj.graphic.canvas;
        var sceneBox = scene.getBoundingClientRect();
        var canvasBox = canvas.getBoundingClientRect(); // Maybe the objects should have their domains readily available?? AAAAH, the domains for all contours should be exactly the same! The parent element will have the right domain!! But that can be added to the translate outside.
        // DEFINITELY DOES NOT DEPEND ON VIEW!!

        var view = obj.parentobj.graphic.view.current;
        var domain = obj.parentobj.data.domain;
        var v2p = view.v2p;
        var dx = (sceneBox.x - canvasBox.x) * v2p;
        var dy = (sceneBox.y - canvasBox.y) * v2p;
        /*
        dx,dy - offset between the box and the canvas.
        obj.data.domain. x/y [0/1] - rebase the data to 0,0
        obj.tools.draw.view.current. x/y [0/1] - rebase the canvas to 0,0
        
        +y - moves up
        +x - moves right
        */

        return [dx - domain.x[0] + view.x[0], -dy - domain.y[1] + view.y[1], 0, 0];
      } // spriteTranslate
      // Functionality to draw on it's specific canvas.

    }, {
      key: "loginMovement",
      value: function loginMovement() {
        var obj = this;
        obj.parentobj.tools.dragged.push(obj);
      } // loginMovement

    }, {
      key: "logoutMovement",
      value: function logoutMovement() {
        var obj = this;
        obj.parentobj.tools.dragged = obj.parentobj.tools.dragged.filter(function (d) {
          return d != obj;
        });
      } // logoutMovement

    }, {
      key: "addCanvas",
      value: function addCanvas() {
        var obj = this; // The size of the canvas should be defined by the parent.

        var d3canvas = d3.select(obj.graphic.wrapper).select(".scene-element").append("canvas").style("width", "100%").style("height", "100%");
        var canvas = d3canvas.node();
        canvasobj.sizeCanvas(canvas);
        return canvas;
      } // addCanvas

    }, {
      key: "removeCanvas",
      value: function removeCanvas() {
        var obj = this; // Clear the overlay canvas, and draw the contour in the background.

        d3.select(obj.graphic.wrapper).selectAll("canvas").remove();
      } // removeCanvas

    }, {
      key: "drawTempImage",
      value: function drawTempImage(canvas) {
        var obj = this; // Get the required config with the webgl tools required.

        var config = makeWebglDrawConfig(canvas); // ~130ms
        // Calculate the appropriate domain and view - the image should appear on the canvas flush in the top left corner.

        var domain = obj.parentobj.data.domain;
        var view = new canvasobj(canvas, obj.parentobj.graphic.view.current.v2p);
        var translate = [-domain.x[0] + view.current.x[0], -domain.y[1] + view.current.y[1], 0, 0]; // Plot all surfaces of this file onto hte canvas.

        obj.file.content.forEach(function (surface) {
          var triMesh = json2bin(surface); // draw clears the whole canvas....

          draw(triMesh, translate, config, view);
        });
        /* GET THE IMAGEDATA
        let gl = config.gl
        let height = canvas.height
        let width = canvas.width
        var pixels = new Uint8Array( width*height* 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        console.log(pixels, d3.extent(pixels), height, width); // Uint8Array
        */
      } // drawTempImage

    }, {
      key: "redrawMasterCanvas",
      value: function redrawMasterCanvas() {
        var obj = this;
        obj.parentobj.render();
      } // redrawMasterCanvas
      // Checking groups, and k-means

    }, {
      key: "checkMembershipOpportunities",
      value: function checkMembershipOpportunities() {
        var obj = this;
        var groups = obj.parentobj.data.sprites.filter(function (spriteobj) {
          return spriteobj instanceof spritegroup && spriteobj != obj;
        }).filter(function (spritegroup) {
          var wrapper = obj.graphic.wrapper;
          return Math.abs(spritegroup.midpoint[0] - obj.midpoint[0]) < wrapper.offsetWidth / 2 && Math.abs(spritegroup.midpoint[1] - obj.midpoint[1]) < wrapper.offsetHeight / 2;
        });

        if (groups.length > 0) {
          // Find which group fits best.
          obj.joinClosestGroup(groups);
        } // if

      } // checkMembershipOpportunities

    }, {
      key: "joinClosestGroup",
      value: function joinClosestGroup(groups) {
        var obj = this;
        var closest = groups.reduce(function (acc, group) {
          var dist = Math.pow(group.midpoint[0] - obj.midpoint[0], 2) + Math.pow(group.midpoint[1] - obj.midpoint[1], 2); // But now it's always added. It should only be added if it's over a group. At least half over the group

          if (acc.group) {
            if (dist < acc.dist) {
              acc.group = group;
              acc.dist = dist;
            } // if

          } else {
            acc.group = group;
            acc.dist = dist;
          } // if


          return acc;
        }, {
          group: undefined,
          dist: undefined
        });
        closest.group.addmembers([obj]);
      } // closestGroup
      // Tasks to perform on drag.

    }, {
      key: "onstart",
      value: function onstart(d) {
        d.loginMovement(); // < 5ms

        var canvas = d.addCanvas(); // < 5ms

        d.drawTempImage(canvas); // ~130ms

        d.redrawMasterCanvas(); // ~70ms
      } // onstart

    }, {
      key: "ondrag",
      value: function ondrag(d) {} // ondrag

    }, {
      key: "onend",
      value: function onend(d) {
        d.logoutMovement();
        d.removeCanvas();
        d.setPositionValues(d.position);
        d.checkMembershipOpportunities();
        d.redrawMasterCanvas();
      } // onend
      // Hide and show.

    }, {
      key: "show",
      value: function show() {
        this.graphic.wrapper.style.display = "block";
      } // show

    }, {
      key: "hide",
      value: function hide() {
        this.graphic.wrapper.style.display = "none";
      } // hide

    }]);

    return sprite;
  }(); // sprite
  // `spritegroup' is the class that controls the group behaviour. It uses much of the same behavior as `sprite', and is similar in appearance. The difference is that a `sprite' represents a single task, while the `spritegroup' connects many.


  var spritegroup = /*#__PURE__*/function (_sprite) {
    _inherits(spritegroup, _sprite);

    var _super = _createSuper(spritegroup);

    function spritegroup(sprites, parentobj) {
      var _this;

      _classCallCheck(this, spritegroup);

      _this = _super.call(this, sprites.map(function (d) {
        return d.task;
      }), parentobj);
      _this.sprites = [];

      var obj = _assertThisInitialized(_this); // Add the sprites to internal storage, reposition all the appropriate DOM wrappers, log the member sprites as `in-transit', and hide their DOM wrappers.


      obj.addmembers(sprites); // Add the file of some sprite to the groupobj. This will be the contour that appears in hte group DOM window on hte master cnavas.

      obj.file = sprites[0].file; // Make additional DOM backbone.

      obj.make(); // Update teh preview elements.

      obj.update();
      return _this;
    } // constructor


    _createClass(spritegroup, [{
      key: "make",
      value: function make() {
        var obj = this; // Make the DOM backbone.

        var d3card = d3.select(obj.graphic.wrapper);
        d3card.attr("class", "group-item");
        var d3groupUtils = d3card.append("div").attr("class", "group-previews");
        var d3groupControls = d3card.append("div").attr("class", "group-controls");
        var ungroupButton = d3groupControls.append("a").attr("class", "btn-circle").style("float", "right").append("i").attr("class", "fa fa-" + "close").style("cursor", "pointer");
        ungroupButton.on("click", function () {
          obj.ungroup();
        }); // Need to implement an ungroup fuctionality? Long click and then a close button??

        d3groupControls.style("display", "none"); // Add functionality to activate it.
        // What about on mouseover and if ctrl is pressed??

        d3card.on("mouseover", function () {
          if (event.ctrlKey) {
            // If the display is already on do nothing, otherwise turn it on.
            if (d3groupControls.style("display") == "none") {
              d3groupControls.style("display", "");
            } // if

          } else {
            if (d3groupControls.style("display") != "none") {
              d3groupControls.style("display", "none");
            } // if

          } // if

        });
        d3card.on("mouseout", function () {
          d3groupControls.style("display", "none");
        });
      } // function

    }, {
      key: "update",
      value: function update() {
        var obj = this; // When new members join the group update the preview elements.

        d3.select(obj.graphic.wrapper).select("div.group-previews").selectAll("div.preview-element").data(obj.sprites, function (d) {
          return d.task.taskId;
        }).join(function (enter) {
          return enter.append("div").attr("class", "preview-element").on("mouseenter", function (sprite) {
            obj.file = sprite.file;
            obj.parentobj.render();
          });
        }, function (update) {
          return update;
        }, function (exit) {
          return exit.remove();
        }); // join
      } // update

    }, {
      key: "addmembers",
      value: function addmembers(sprites) {
        var obj = this;
        obj.sprites = obj.sprites.concat(sprites); // Pile the constituent sprites.

        var anchor = obj.pile();
        obj.setPositionValues(anchor); // Log the constituent sprites as in transit so they don't need to be drawn. Also, hide their DOMs - they won't be needed as long as they are in a group.

        sprites.forEach(function (sprite) {
          sprite.loginMovement();
          sprite.hide();
        }); // Update the preview divs.

        obj.update();
      } // addmembers

    }, {
      key: "ungroup",
      value: function ungroup() {
        // Log the sprites out of movement, and show their DOM windows again.
        var obj = this; // A group can also contain other groups. The contained groups should still contain all their sprites. Collect the groups here, and don't release any of their sprites.

        var groups = obj.sprites.filter(function (sprite) {
          return sprite instanceof spritegroup;
        }); // When ungrouping offset the constituent members a bit, so that it is apparent there are several sprites there.

        var ungrouped = obj.sprites.filter(function (sprite) {
          return !groups.some(function (group) {
            return group.sprites.includes(sprite);
          });
        }); // filter

        var arc = 2 * Math.PI / ungrouped.length;
        ungrouped.forEach(function (sprite, i) {
          var offset = [10 * Math.cos(arc * i), 10 * Math.sin(arc * i)];
          sprite.position = obj.position.map(function (p, j) {
            return p + offset[j];
          });
          sprite.logoutMovement();
          sprite.show();
        }); // Remove the dom wrapper, and remove itself from the parent.

        obj.graphic.wrapper.remove();
        obj.parentobj.data.sprites = obj.parentobj.data.sprites.filter(function (sprite) {
          return sprite != obj;
        });
        obj.parentobj.render();
      } // ungroup

    }, {
      key: "size",
      value: function size() {
        _get(_getPrototypeOf(spritegroup.prototype), "size", this).call(this);

        var d3card = d3.select(this.graphic.wrapper);
        d3card.select("div.group-previews").style("max-width", d3card.select("div.scene-element").node().offsetWidth + "px");
      } // size

    }, {
      key: "pile",
      value: function pile() {
        // Calculate the anchor of the selection, and position all the sprites there.
        var obj = this;
        var anchor = obj.sprites.reduce(function (acc, sprite) {
          var m = sprite.position;
          acc[0] += m[0] / obj.sprites.length;
          acc[1] += m[1] / obj.sprites.length;
          return acc;
        }, [0, 0]);
        obj.sprites.forEach(function (sprite) {
          sprite.position = anchor;
          sprite.setPositionValues(anchor);
        }); // Return the selection anchor to allow the group DOM to be positioned there.

        return anchor;
      } // pile

    }, {
      key: "onend",
      value: function onend(d) {
        _get(_getPrototypeOf(spritegroup.prototype), "onend", this).call(this, d); // Also adjust internal position of all member sprites.


        d.sprites.forEach(function (sprite) {
          sprite.position = d.position;
        });
      } // onend

    }]);

    return spritegroup;
  }(sprite); // spritegroup
  // The main plot.


  var cfD3Contour2d = /*#__PURE__*/function () {
    function cfD3Contour2d(config) {
      _classCallCheck(this, cfD3Contour2d);

      // What should enter here? A reference to the basic plot structure. And of course the slice it's supposed to draw.  
      // A `sprite' is an image on the canvas.
      this.graphic = {
        sliceId: config.sliceId,
        wrapper: config.wrapper,
        container: d3.select(config.wrapper).select("div.content").node(),
        canvas: document.getElementById("plotcanvas"),
        overlay: document.getElementById("overlay"),
        view: undefined
      }; // format
      // Can eventually be wrapped in the builder.

      canvasobj.sizeCanvas(this.graphic.canvas);
      d3.select(this.graphic.wrapper.getElementsByClassName("content")[0]).datum(this);
      d3.select(this.graphic.canvas).datum(this); // When the plot is updated a new `contourobj' is created for every task in the filter. There is no separation into available and missing, but instead any `contourobjs' for which the files are not retrieved will not have any data, and thus won't be plotted. In essence, the available and missing are not explicitly stated, but can be worked out.

      this.data = {
        sprites: [],
        urls: [],
        domain: []
      }; // data
      this.tools = {
        dragged: [],
        // logs which sprites are being moved
        selected: [],
        // log the lassoed sprites
        draw: makeWebglDrawConfig(this.graphic.canvas),
        lasso: new lasso(this.graphic.overlay, this),
        toolbar: new toolbar(this),
        trending: undefined
      }; // tools
      // HANDLE THE ZOOM

      d3.select(this.graphic.canvas).call(d3.zoom().scaleExtent([0.01, Infinity]).on("zoom", function zoomCanvas(obj) {
        obj.graphic.view.transform();
        obj.render();
      }));
    } // constructor
    // Redraw the master canvas.


    _createClass(cfD3Contour2d, [{
      key: "render",
      value: function render() {
        // Render draws only the contours that are currently not in transit. This allows the background canvas to hold the appropriate background image during interactions.
        // The visualisation consists of 2 layers - the canvas image, and the DOM overlay. The overlay takes care of drawing the card and the border shadow. The cards must be placed correctly over the contour images. The location of the DOM element is readily accessible, and therefore the canvas draws to the location of the card.
        // The cards potentially need to be resized during hte exploration. This must also be done here.
        var obj = this; // Resize the DOM cards.

        obj.data.sprites.forEach(function (spriteobj) {
          spriteobj.reposition(spriteobj.positionvalues);
          spriteobj.size();
        }); // foreach
        // Clear canvas.

        obj.tools.draw.gl.clear(obj.tools.draw.gl.clearColor(0, 0, 0, 0)); // Collect all the objects that are not currently being moved.

        var stationary = obj.data.sprites.filter(function (obj_) {
          return obj.tools.dragged.indexOf(obj_) < 0;
        });
        stationary.forEach(function (spriteobj) {
          // Find the translation to position the image into the dom container.
          var translate = spriteobj.translation; // Plot all surfaces of this file onto hte canvas.

          spriteobj.file.content.forEach(function (surface) {
            var mesh = json2bin(surface); // draw clears the whole canvas....

            draw(mesh, translate, obj.tools.draw, obj.graphic.view);
          });
        }); // forEach
        // Update the trending.

        obj.correlations();
      } // render
      // t-sne to position cards.

    }, {
      key: "position",
      value: function position() {
        // Position the sprites using t-sne
        var obj = this;
        var cp = obj.data.sprites.map(function (d) {
          return d.file.content[0].data.Cp;
        }); // The options MUST be configured correctly for t-sne to produce meaningful results!!
        // perplexity must be smaller than the number of actual cases, maybe a third or so?

        var opt = {};
        opt.epsilon = 10; // epsilon is learning rate (10 = default)

        opt.perplexity = Math.round(cp.length / 5); // roughly how many neighbors each point influences (30 = default)

        opt.dim = 2; // dimensionality of the embedding (2 = default)

        var tsne = new tSNE(opt); // create a tSNE instance
        // initialize the raw data.

        tsne.initDataRaw(cp);

        for (var k = 0; k < 5000; k++) {
          tsne.step(); // every time you call this, solution gets better
        } // for


        var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot
        // This z-score should erally be axis sensitive.

        var xdom = d3.extent(Y, function (d) {
          return d[0];
        });
        var ydom = d3.extent(Y, function (d) {
          return d[1];
        });
        var canvas = obj.graphic.view.canvas;
        obj.data.sprites.forEach(function (sprite, i) {
          // Give the position in terms of DOM coordinates.
          var pos = [(Y[i][0] - xdom[0]) / (xdom[1] - xdom[0]) * (canvas.width - 200) + canvas.offsetLeft, (Y[i][1] - ydom[0]) / (ydom[1] - ydom[0]) * (canvas.height - 100) + canvas.offsetTop];
          sprite.setPositionValues(pos);
          sprite.reposition(sprite.positionvalues);
        });
        obj.render();
      } // position
      // t-sne position reinitialisation.

    }, {
      key: "restart",
      value: function restart() {
        var obj = this; // First remove all the groups.

        obj.data.sprites = obj.data.sprites.filter(function (sprite) {
          var isgroup = sprite instanceof spritegroup;

          if (isgroup) {
            sprite.ungroup();
          } // if


          return !isgroup;
        }); // filter
        // Now show all the sprite DOMs.

        obj.data.sprites.forEach(function (sprite) {
          sprite.show();
          sprite.logoutMovement();
        }); // forEach

        obj.position();
      } // restart
      // k-means categorication.

    }, {
      key: "cluster",
      value: function cluster() {
        var obj = this;
        /* 
        This plot can be seen as the interface for the k-means algorithm. Three inputs need to be provided to the k-means algorithm: 
        	1.) Number of clusters
        	2.) Initial centroids
        	3.) Distance metric
        
        The groups provide a natural way to capture the first two inputs. It is assumed that the user has built representative groups. The number of groups can be used as the number of clusters. Any sprites that are not a part of group can be added to the closest group. Then the centroids are the means of the sprites of a group.
        */
        // Remove all the kmeans styling.

        obj.data.sprites.forEach(function (sprite) {
          sprite.graphic.wrapper.style.border = "none";
        }); // forEach
        // Wrap the sprites and spritegroups into surrogate objects to be used during clustering.

        var points = obj.data.sprites.filter(function (sprite) {
          return !(sprite instanceof spritegroup);
        }).map(function (sprite) {
          return {
            refobj: sprite,
            pos: sprite.midpoint,
            cp: sprite.file.content[0].data.Cp
          };
        }); // map
        // How to make sure that the groups within groups are not used as the kernels?

        console.log("keep in mind the groups within the groups!!");
        var groups = obj.data.sprites.filter(function (sprite) {
          return sprite instanceof spritegroup;
        }); // filter

        var topgroups = groups.filter(function (group) {
          // Top groups are those that do not appear in other groups.
          return !groups.some(function (group_) {
            return group_.sprites.includes(group);
          }); // some
        }).map(function (sprite, i) {
          return new kgroup(sprite, sprite.midpoint);
        }); // map
        // Also check here if there are enough groups to perform clustering.

        if (topgroups.length > 1) {
          var kmeans$1 = new kmeans(points);
          topgroups.forEach(function (group) {
            kmeans$1.addgroup(group);
          }); // forEach

          kmeans$1.cluster(); // Indicate the grouping results. A good compromise (discussed above) is to just keep the sprites, and color code their borders. The groups should be removed. It's relatively easy to create a new group using the lasso tool anyway.

          kmeans$1.groups.forEach(function (group) {
            group.refobj.ungroup();
          }); // forEach
          // Store the kmeans object.

          obj.tools.kmeans = kmeans$1; // Unhighlighting removes the lasso highlight, and applies underlying highlights, such as the k-means clustering highlight.

          obj.unhighlight(); // Also, when clustering has been performed update the control button group. It will now need to feature a button that clears the clustering.
        } // if


        obj.render();
      } // cluster
      // Spearman rank correlation.

    }, {
      key: "correlations",
      value: function correlations() {
        var obj = this; // Update the correlations.

        var ordinal = ["max_cmb", "max_cmb_pos", "max_t"];
        var scores = statistics.correlation(obj.data.sprites, ordinal);
        console.log("Correlations", scores);
      } // correlations
      // Lasso tools.

    }, {
      key: "onlassostart",
      value: function onlassostart() {
        var obj = this; // Remove all toolbar.

        obj.tools.toolbar.hide(); //
      } // onlassostart

    }, {
      key: "onlassoend",
      value: function onlassoend() {
        // Find all the sprites that were selected by the lasso.
        var obj = this; // Find the circled tasks.

        var selected = obj.data.sprites.filter(function (spriteobj) {
          return obj.tools.lasso.iswithin(spriteobj.midpoint);
        }); // Highlight the corresponding DOM elements.

        selected.forEach(function (spriteobj) {
          spriteobj.graphic.wrapper.style.border = "solid 4px gainsboro";
        }); // Save the current selection.

        obj.tools.selected = selected; // Make a toolbar.

        obj.tools.toolbar.show();
      } // onlassoend
      // Grouping functionality

    }, {
      key: "ongroup",
      value: function ongroup() {
        // Create a new `spritegroup', and log it into the `cfD3Contour2d' instance. It should be logged alongside the regular sprites.
        var obj = this; // The obj has access to the lassoed elements under `obj.tools.selected'. If 

        obj.data.sprites.push(new spritegroup(obj.tools.selected, obj)); // Rerender the master canvas.

        obj.render(); // Hide the toolbar.

        obj.tools.toolbar.hide(); // Remove the border highlight.

        obj.unhighlight();
      } // ongroup

    }, {
      key: "unhighlight",
      value: function unhighlight() {
        var obj = this; // First remove the border highlight.

        obj.data.sprites.forEach(function (spriteobj) {
          spriteobj.graphic.wrapper.style.border = "none";
        }); // See if a clustering highlight may be is still required/

        if (obj.tools.kmeans) {
          var bordercolor = d3.scaleOrdinal(d3.schemeCategory10);
          obj.tools.kmeans.points.forEach(function (point) {
            point.refobj.graphic.wrapper.style.border = "solid 4px " + bordercolor(point.groupid);
          }); // forEach
        } // if

      } // unhighlight
      // Requesting and adding data to the plot.

    }, {
      key: "update",
      value: function update(fileobjs) {
        // `add' marries the incoming fileobjs to the correponding internal contour objects.
        // Needs to figure out how to handle empty fileobjs!!
        var obj = this; // Marry the files to the appropriate objects.

        obj.data.sprites.forEach(function (contourobj) {
          // See if the appropriate file is available.
          var files = fileobjs.filter(function (d) {
            return d.url == contourobj.task[obj.graphic.sliceId];
          });

          if (files.length > 0) {
            contourobj.file = files[0];
          } // if

        }); // forEach
        // Remove any objects without a file? Or render them empty to tell hte user that a particular file was not found??
        // With the objects and files married, calculate the domain of all variables available.

        obj.data.domain = cfD3Contour2d.domain(obj.data.sprites.map(function (d) {
          return d.file;
        })); // Now calculate the view of the entire canvas.

        var valPerPx = (obj.data.domain.x[1] - obj.data.domain.x[0]) / canvasobj.spritewidth;
        obj.graphic.view = new canvasobj(obj.graphic.canvas, valPerPx); // Now that the domain and view are determined, compute the position value.

        obj.data.sprites.forEach(function (spriteobj) {
          spriteobj.setPositionValues(spriteobj.position);
        }); // The update is the re-render.

        obj.position();
      } // update

    }, {
      key: "request",
      value: function request(tasks) {
        // `dbsliceData' asked which files corresponding to the given tasks this plot requires in order to update it's view. 
        // Within functions the meaning of `this' changes to the local value, as opposed to the class instance.
        var obj = this; // Store a reference to all hte files needed for this plot on hte last update.

        obj.data.urls = tasks.map(function (task) {
          return task[obj.graphic.sliceId];
        }); // Find which of the currently plotted contours has files that will be retained, and which should be removed. The check is done on tasks, as there may be a situation in which the slice of the plot changes, but we still want to keep all the on-screen objects.

        obj.data.sprites = obj.data.sprites.filter(function (contourobj) {
          return tasks.includes(contourobj.task);
        }); // filter
        // Create additional contour objects based on the tasks that are not yet represented.

        var plottedTasks = obj.data.sprites.map(function (d) {
          return d.task;
        });
        tasks.forEach(function (task) {
          if (!plottedTasks.includes(task)) {
            obj.data.sprites.push(new sprite(task, obj));
          } // if

        }); // forEach
        // The positioning on-screen should be handled by t-sne immediately!!
        // If I'm marrying the files to the objects later on I don't need to check for availability.
        // Now collect all the urls that are required.

        var required = obj.data.urls.map(function (url) {
          return {
            url: url,
            filename: url
          };
        }); // Make, collect, and return the load promises.

        return {
          classref: contour2dFile,
          files: required
        };
      } // request
      // Move into the file class object??

    }], [{
      key: "domain",
      value: function domain(files) {
        // It is simpler to allow the user to pick any variable, and just not draw anything if data for that surface is not available.
        // So here just find the domains of x, y, and Cp for all hte files and surfaces.
        var domain = files.reduce(function (acc, file) {
          file.content.forEach(function (surface) {
            acc.x = d3.extent([].concat(_toConsumableArray(acc.x), _toConsumableArray(surface.data.x)));
            acc.y = d3.extent([].concat(_toConsumableArray(acc.y), _toConsumableArray(surface.data.y)));
            surface.variables.forEach(function (variable) {
              var v = acc[variable];

              if (v) {
                v = d3.extent([].concat(_toConsumableArray(v), _toConsumableArray(surface.data[variable])));
              } else {
                acc[variable] = d3.extent(surface.data[variable]);
              } // if

            });
          }); // forEach

          return acc;
        }, {
          x: [],
          y: []
        });
        return domain;
      } // domain

    }]);

    return cfD3Contour2d;
  }(); // cfD3Contour2d
  // HELPERS
  // WEBGL DRAWING. - make a webgl drawing class -> webgldrawmesh?
  // Info on webgl
  // http://math.hws.edu/graphicsbook/c7/s1.html#webgl3d.1.2	

  var fragshader = ['precision highp float;', 'uniform sampler2D u_cmap;', 'uniform float u_cmin, u_cmax;', 'varying float v_val;', 'void main() {', '  gl_FragColor = texture2D(u_cmap, vec2( (v_val-u_cmin)/(u_cmax-u_cmin) ,0.5));', '}'].join("\n");
  var vertshader = ['attribute vec2 a_position;', 'attribute float a_val;', 'uniform vec4 u_translate;', 'uniform mat4 u_matrix;', 'varying float v_val;', 'void main() {', '  gl_Position = u_matrix*(vec4(a_position,0,1)+u_translate);', '  v_val = a_val;', '}'].join("\n");

  function makeWebglDrawConfig(canvas) {
    var t0 = performance.now();
    var webglTools = makeWebglTools(canvas, vertshader, fragshader);
    var t1 = performance.now();
    console.log("makeWebglTools took " + (t1 - t0) + " ms.");
    var cmap = colormap("s");
    return {
      gl: webglTools.gl,
      programInfo: webglTools.programInfo,
      colormapTexture: twgl.createTexture(webglTools.gl, {
        mag: webglTools.gl.LINEAR,
        min: webglTools.gl.LINEAR,
        src: cmap,
        width: cmap.length / 4,
        height: 1
      })
    };
  } // makeWebglDrawConfig


  function makeWebglTools(canvas, vertshader, fragshader) {
    // MODIFICATION: preserveDrawingBuffer: true
    // This allows plotting several items on-top of each other.
    var gl = canvas.value = canvas.getContext("webgl", {
      antialias: true,
      depth: false
    });
    twgl.addExtensionsToContext(gl); // Program info = move into make?

    var programInfo = twgl.createProgramInfo(gl, [vertshader, fragshader]);
    gl.useProgram(programInfo.program);
    return {
      gl: gl,
      programInfo: programInfo
    };
  } // makeWebglTools


  function colormap(name) {
    var cmap;

    switch (name) {
      case "spectral":
        cmap = [[158, 1, 66, 255], [185, 31, 72, 255], [209, 60, 75, 255], [228, 86, 73, 255], [240, 112, 74, 255], [248, 142, 83, 255], [252, 172, 99, 255], [253, 198, 118, 255], [254, 221, 141, 255], [254, 238, 163, 255], [251, 248, 176, 255], [241, 249, 171, 255], [224, 243, 160, 255], [200, 233, 159, 255], [169, 220, 162, 255], [137, 207, 165, 255], [105, 189, 169, 255], [78, 164, 176, 255], [66, 136, 181, 255], [74, 108, 174, 255], [94, 79, 162, 255]];
        break;

      default:
        cmap = d3.range(0, 1.05, 0.05).map(function (d) {
          return hex2rgb(d3.interpolateViridis(d));
        });
    } // switch


    return new Uint8Array([].concat.apply([], cmap)); // Local helper function to transform a hex color code to a rgb triplet.

    function hex2rgb(hex) {
      // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); // Format result appropriately.

      return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 255] : null;
    } // hex2rgb

  } // colormap


  function draw(mesh, translate, config, view) {
    // Shows the parts of config that are needed.
    var gl = config.gl;
    var programInfo = config.programInfo;
    var colormapTexture = config.colormapTexture; // Create the buffers.

    var arrays = {
      a_position: {
        numComponents: 2,
        data: mesh.vertices
      },
      a_val: {
        numComponents: 1,
        data: mesh.values
      },
      indices: {
        numComponents: 3,
        data: mesh.indices
      }
    };
    var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    var mat4 = glMatrix.mat4;
    var projectionMatrix = mat4.create(); // NEED to be declared separately for some reason.

    var xMin = view.current.x[0];
    var xMax = view.current.x[1];
    var yMin = view.current.y[0];
    var yMax = view.current.y[1];
    mat4.ortho(projectionMatrix, xMin, xMax, yMin, yMax, 0, 1.); // u_translate has been added to specify the location where the image should be plotted.	

    var uniforms = {
      u_matrix: projectionMatrix,
      u_translate: translate,
      u_cmap: colormapTexture,
      u_cmin: mesh.domain.v[0],
      u_cmax: mesh.domain.v[1]
    };
    twgl.setUniforms(programInfo, uniforms); // Do the actual drawing

    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_INT, 0);
  } // draw
  // BELONG TO OTHER MODULES
  // FORMAT CONVERTER - migrate to contour2dFile


  function json2bin(surface) {
    var x = surface.data.x;
    var y = surface.data.y;
    var values = surface.data.Cp;
    var nx = surface.data.size[0];
    var ny = surface.data.size[1];
    var vertices = [];

    for (var i = 0; i < x.length; i++) {
      vertices.push(x[i]);
      vertices.push(y[i]);
    } // for
    // It's a structured mesh in this case, but in principle it could be unstructured. The vertices are declared in rows.
    // The indices array points to the value in thevertices array for a particular point. In that case does the shader take the appropriate pair from the vertices array, or a single node? If it takes a single value, then why arent the x and y specified together??


    function grid2vec(row, col) {
      return row * nx + col;
    }

    var indices = [];
    var ne, nw, sw, se; // Create indices into the `vertices' array

    for (var row = 0; row < ny - 1; row++) {
      for (var col = 0; col < nx - 1; col++) {
        // For every row and column combination there are 4 vertices, which make two triangles - the `upper' and `lower' triangles. 
        // Corners on a grid. Just the sequential number of the vertex.
        nw = grid2vec(row, col);
        ne = grid2vec(row, col + 1);
        sw = grid2vec(row + 1, col);
        se = grid2vec(row + 1, col + 1); // `upper'

        indices.push(sw, nw, ne); // `lower'

        indices.push(sw, se, ne);
      } // for

    } // for


    return {
      vertices: new Float32Array(vertices),
      values: new Float32Array(values),
      indices: new Uint32Array(indices),
      domain: {
        x: d3.extent(x),
        y: d3.extent(y),
        v: d3.extent(values)
      }
    };
  } // json2bin
  // Basic dragging of a relative positioned element.


  var dragCard = /*#__PURE__*/function () {
    function dragCard() {
      _classCallCheck(this, dragCard);

      var obj = this; // Maybe the actual drag should be made outside?? Or should I just make the accessors here?? And wrap them into hte wrapper functions??

      this.obj = d3.drag().on("start", function (d) {
        obj.onstart(d);

        if (d.onstart) {
          d.onstart(d);
        }
      }).on("drag", function (d) {
        obj.ondrag(d);

        if (d.ondrag) {
          d.ondrag(d);
        }
      }).on("end", function (d) {
        obj.onend(d);

        if (d.onend) {
          d.onend(d);
        }
      });
    } // constructor


    _createClass(dragCard, [{
      key: "onstart",
      value: function onstart(d) {
        // `d' is the bound object.
        d.graphic.position.mouse = dragCard.getMousePosition(d);
      } // onstart

    }, {
      key: "ondrag",
      value: function ondrag(d) {
        var position = dragCard.calculateNewPosition(d); // Move the wrapper.

        d3.select(d.graphic.wrapper).style("left", position.x + "px").style("top", position.y + "px"); // Needs a connection to hte top object now...
      } // ondrag

    }, {
      key: "onend",
      value: function onend(d) {} // onend

    }], [{
      key: "calculateNewPosition",
      value: function calculateNewPosition(d) {
        // Get the current wrapper position and the mouse movement on increment.
        var wrapper = dragCard.getWrapperPosition(d);
        var movement = dragCard.calculateMouseMovement(d);
        var width = d.parentobj.graphic.wrapper.offsetWidth; // Don't apply boundaries to movement - if cards are on the side of the canvas when zoomed it prevents them from being dragged.
        // movement = dragCard.applyMovementBoundaries(movement, wrapper, width)

        return {
          x: wrapper.x + movement.x,
          y: wrapper.y + movement.y
        };
      } // calculateNewPosition

    }, {
      key: "getMousePosition",
      value: function getMousePosition(d) {
        var mousePosition = d3.mouse(d.parentobj.graphic.wrapper);
        return {
          x: mousePosition[0],
          y: mousePosition[1]
        };
      } // getMousePosition

    }, {
      key: "getWrapperPosition",
      value: function getWrapperPosition(d) {
        // Calculate the position of the wrapper relative to it's parent
        var el = d.graphic.wrapper;
        return {
          x: parseInt(el.style.left),
          y: parseInt(el.style.top),
          w: el.offsetWidth,
          h: el.offsetHeight
        };
      } // getWrapperPosition

    }, {
      key: "calculateMouseMovement",
      value: function calculateMouseMovement(d) {
        var mp0 = d.graphic.position.mouse;
        var mp1 = dragCard.getMousePosition(d);
        var movement = {
          x: mp1.x - mp0.x,
          y: mp1.y - mp0.y
        };
        d.graphic.position.mouse = mp1;
        return movement;
      } // calculateMouseMovement

    }, {
      key: "applyMovementBoundaries",
      value: function applyMovementBoundaries(movement, wrapper, width) {
        // Stop the movement exceeding the container bounds.
        var rightBreach = wrapper.w + wrapper.x + movement.x > width;
        var leftBreach = wrapper.x + movement.x < 0;

        if (rightBreach || leftBreach) {
          movement.x = 0;
        } // if
        // Bottom breach should extend the plot!


        if (wrapper.y + movement.y < 0) {
          movement.y = 0;
        } // if


        return movement;
      } // applyMovementBoundaries

    }]);

    return dragCard;
  }(); // dragCard
  // Lasso


  var lasso = /*#__PURE__*/function () {
    /*
    `lasso' creates a new lasso instance, based on the `overlay' svg dom element. In addition to collecting the points selected by the user it also performs a user specified action on the start and end of lassoing.
    
    The lasso only collects the selected region, and passes it to the user. The search for any data in the graphic must be done by the plot. Lasso does provide functionality (lasso.iswithin) to check whether a particular pixel on the svg is within it.
    */
    function lasso(overlay, parentobj) {
      _classCallCheck(this, lasso);

      // Declare the most important attributes. Note that the lasso does NOT find it's own selected data! The `selected' attribute is only a placeholder here to allow the user to store the results in it. This is to simplify the lasso code by moving the data identification out.
      this.svg = overlay;
      this.boundary = []; // Add behavior to the overlay.

      d3.select(overlay.parentElement).on("mousemove", function () {
        if (event.shiftKey) {
          overlay.style.display = "block";
        } else {
          overlay.style.display = "none";
        } // if

      }); // on

      var obj = this;
      d3.select(overlay).call(d3.drag().on("start", function () {
        // Clear previous lasso, remove graphic, remove toolbar.
        obj.boundary = [];
        obj.draw();
        parentobj.onlassostart(obj);
      }) // on
      .on("drag", function () {
        obj.addpoint();
        obj.draw();
      }) // on
      .on("end", function () {
        if (obj.boundary.length > 3) {
          parentobj.onlassoend(obj);
        } // if


        obj.remove();
      }) // on
      ); // call
    } // constructor


    _createClass(lasso, [{
      key: "addpoint",
      value: function addpoint() {
        var obj = this;
        obj.boundary.push(d3.mouse(obj.svg));
      } // addpoint

    }, {
      key: "iswithin",
      value: function iswithin(point) {
        // Check wheteher the `point' is within the polygon defined by the boundary of the lasso in `this.boundary'. The check is based on the idea that any ray starting from `point' must pass the boundary an odd number of times if it is within it, and an even number of times otherwise. For simplicity a horizontal ray was selected. The boundary is imagined as straight segments between neighbouring points of `this.boundary'. Every segment is checked to see whether the ray crosses it. As the ray is expected to run in one dimension only, the `isInside' flag is only changed if the segment is a boundary segment, AND if the crossing point is to the right of the initial point. The check could be optimised further by only considering the part of the lasso that is to the right of the selected point. A separate improvement could allow the user to input an array of points to be checked.
        var boundary = this.boundary;
        var isInside = false;

        for (var i = 1; i < boundary.length; i++) {
          checkIntersect(boundary[i - 1], boundary[i], point);
        } // for


        checkIntersect(boundary[boundary.length - 1], boundary[0], point);
        return isInside; // Need to check the same number of edge segments as vertex points. The last edge should be the last and the first point.

        function checkIntersect(p0, p1, point) {
          // One point needs to be above, while the other needs to be below -> the above conditions must be different.
          if (p0[1] > point[1] !== p1[1] > point[1]) {
            // One is above, and the other below. Now find if the x are positioned so that the ray passes through. Essentially interpolate the x at the y of the point, and see if it is larger.
            var x = (p1[0] - p0[0]) / (p1[1] - p0[1]) * (point[1] - p0[1]) + p0[0];
            isInside = x > point[0] ? !isInside : isInside;
          } // if

        } // checkIntersect

      } // iswithin

    }, {
      key: "draw",
      value: function draw() {
        var obj = this; // Create the data for a single polygon

        var d = [obj.boundary.map(function (d) {
          return d.join();
        }).join(" ")];
        d3.select(obj.svg).selectAll("polygon").data(d).join(function (enter) {
          return enter.append("polygon").attr("points", function (d) {
            return d;
          }).style("fill", "cornflowerblue").style("stroke", "dodgerblue").style("stroke-width", 2).attr("opacity", 0.4);
        }, function (update) {
          return update.attr("points", function (d) {
            return d;
          });
        }, function (exit) {
          return exit.remove();
        }); // join
      } // draw

    }, {
      key: "remove",
      value: function remove() {
        var obj = this;
        d3.select(obj.svg).selectAll("polygon").remove();
      } // remove

    }]);

    return lasso;
  }(); // lasso
  // Grouping toolbar


  var toolbar = /*#__PURE__*/function () {
    function toolbar(parentobj) {
      _classCallCheck(this, toolbar);

      // Has to have the graphic,
      this.graphic = {
        wrapper: undefined,
        position: {}
      }; // graphic

      this.parentobj = parentobj; // Make the toolbar.

      var d3toolbar = d3.select(parentobj.graphic.wrapper).append("div").attr("class", "contourTooltip").style("display", "none").style("cursor", "pointer");
      this.graphic.wrapper = d3toolbar.node(); // Add the dragging.

      var dragobj = new dragCard();
      d3toolbar.datum(this);
      d3toolbar.call(dragobj.obj); // MOVE? : Should the assemply of options be moved outside for greater flexibility? Also, how would I otherwise access the functionality required?? 

      var obj = this;
      addButton("stack-overflow", function (d) {
        return parentobj.ongroup();
      });
      addButton("tags", function (d) {
        return console.log("tag");
      });
      addButton("close", function (d) {
        obj.hide();
        parentobj.unhighlight();
      });

      function addButton(icon, event) {
        d3toolbar.append("button").attr("class", "btn").on("click", event).append("i").attr("class", "fa fa-" + icon).style("cursor", "pointer");
      } // addButton

    } // constructor


    _createClass(toolbar, [{
      key: "show",
      value: function show() {
        // Position hte tooltip By finding the mean of all hte selected sprites.
        var obj = this;
        var selected = obj.parentobj.tools.selected;
        var position = selected.reduce(function (total, spriteobj) {
          var midpoint = spriteobj.midpoint;
          total.x += midpoint[0] / selected.length;
          total.y += midpoint[1] / selected.length;
          return total;
        }, {
          x: 0,
          y: 0
        }); // Offset by the expected tooltip size. How to calculate that when display:none?

        var style = obj.graphic.wrapper.style;
        style.display = "block";
        style.left = position.x - 100 + "px";
        style.top = position.y - 30 + "px";
      } // show

    }, {
      key: "hide",
      value: function hide() {
        var obj = this;
        obj.graphic.wrapper.style.display = "none";
      } // hide

    }]);

    return toolbar;
  }(); // toolbar
  // FOR THIS SOME ADDITIONAL METADATA WILL BE REQUIRED!!
  // The trending and statistics object.


  var statistics = {
    drawCorrelation: function drawCorrelation(trendingCtrlGroup) {
      var i = cfD3Contour2d.interactivity; // Get the scores

      var scores = i.statistics.correlation(trendingCtrlGroup.datum().tools.trending); // Get a palette

      var score2clr = d3.scaleLinear().domain([0, 1]).range([0, 0.75]);
      trendingCtrlGroup.selectAll("select").each(function () {
        // Determine if it's x or y select
        var axis = d3.select(this).attr("axis");

        var color = function color(d) {
          return d3.interpolateGreens(score2clr(Math.abs(d.score[axis])));
        };

        d3.select(this).selectAll("option").data(scores).join(function (enter) {
          return enter.append("option").attr("value", function (d) {
            return d.name;
          }).html(function (d) {
            return d.label[axis];
          }).style("background-color", color);
        }, function (update) {
          return update.attr("value", function (d) {
            return d.name;
          }).html(function (d) {
            return d.label[axis];
          }).style("background-color", color);
        }, function (exit) {
          return exit.remove();
        });
      });
    },
    // drawCorrelation
    correlation: function correlation(sprites, variables) {
      var scores = variables.map(function (variable) {
        // For each of the data variables calculate a correlation.
        // Collect the data to calculate the correlation.
        var d = sprites.map(function (sprite) {
          var pos = sprite.midpoint;
          return {
            x: pos[0],
            y: pos[1],
            val: sprite.task[variable]
          }; // return
        }); // map

        /* Get Spearman's rank correlation scores  (https://en.wikipedia.org/wiki/Spearman%27s_rank_correlation_coefficient) for the order in a direction.
        
        The coefficient is:
          covariance (x_rank, y_rank )/( sigma(rank_x) sigma(rank_y) )
        */

        var cov = statistics.covariance(d);
        var sigma_x = d3.deviation(d, function (d) {
          return d.x;
        });
        var sigma_y = d3.deviation(d, function (d) {
          return d.y;
        });
        var sigma_val = d3.deviation(d, function (d) {
          return d.val;
        });
        sigma_x = sigma_x == 0 ? Infinity : sigma_x;
        sigma_y = sigma_y == 0 ? Infinity : sigma_y;
        sigma_val = sigma_val == 0 ? Infinity : sigma_val;
        var score = {
          x: cov.x / (sigma_x * sigma_val),
          y: cov.y / (sigma_y * sigma_val)
        };
        var label = {
          x: score.x < 0 ? "- " + variable : "+ " + variable,
          y: score.y < 0 ? "- " + variable : "+ " + variable
        };
        return {
          name: variable,
          label: label,
          score: score
        };
      }); // map
      // Before returning the scores, order them.

      scores.sort(function (a, b) {
        return a.score - b.score;
      });
      return scores;
    },
    // correlation
    covariance: function covariance(d) {
      // 'd' is an array of observations. Calculate the covariance between x and the metadata variable.
      var N = d.length;
      var mu_x = d3.sum(d, function (d) {
        return d.x;
      }) / N;
      var mu_y = d3.sum(d, function (d) {
        return d.y;
      }) / N;
      var mu_val = d3.sum(d, function (d) {
        return d.val;
      }) / N;
      var sumx = 0;
      var sumy = 0;

      for (var i = 0; i < N; i++) {
        sumx += (d[i].x - mu_x) * (d[i].val - mu_val);
        sumy += (d[i].y - mu_y) * (d[i].val - mu_val);
      }

      return {
        x: 1 / (N - 1) * sumx,
        y: 1 / (N - 1) * sumy
      };
    } // covariance

  }; // statistics

  var nacaDesignations = ['0006', '0008', '0010', '0015', '0018', '0021', '0024', '1408', '1410', '1412', '23012', '23015', '23018', '23021', '23024', '2408', '2410', '2411', '2412', '2415', '2418', '2421', '2424', '4412', '4415', '4418', '4421', '4424', '6412']; // nacaDesignations  

  var tasks = nacaDesignations.map(function (name) {
    var five_series = name.length == 5;
    return {
      taskId: name,
      slice: "/data/xfoil2d/vels_repanelled_naca_" + name + ".json",
      max_cmb: five_series ? 1.761 : Number(name.substr(0, 1)),
      max_cmb_pos: Number(name.substr(1, 1)),
      max_t: Number(name.substr(name.length - 2, 2))
    };
  });
  var plot = new cfD3Contour2d({
    sliceId: "slice",
    wrapper: document.getElementById("plotWrapper")
  }); // Ask dbsliceData to load the file.
  // Import the files

  var requested = plot.request(tasks);
  var promises = dbsliceData.importing.batch(requested.classref, requested.files); // Launch a task upon loading completion.

  Promise.allSettled(promises).then(function (promiseobjs) {
    // Pipe the results back into the contour.
    var fileobjs = promiseobjs.filter(function (promiseobj) {
      return promiseobj.value.content != undefined;
    }).map(function (d) {
      return d.value;
    });
    plot.update(fileobjs);
  }); // then
  // Add functionality to the buttons.

  d3.select(document.getElementById("tsne")).on("click", function () {
    plot.restart();
  }); // on

  d3.select(document.getElementById("kmeans")).on("click", function () {
    plot.cluster();
  }); // on

}());
