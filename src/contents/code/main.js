(function () {
"use strict";
    print(inspect(workspace.activeClient, 0, ['activeClient']))
    print('workspaceSize: ' + inspect(workspace.workspaceSize))
    print('w' + workspace.workspaceWidth + 'h:' + workspace.workspaceHeight)
  var panelMargin = {
     top: 27   
  }
  var margin = {
    top: 14,
    bottom: 16,
    left: 16,
    right: 16,
    center: 12
  }

  var clients = workspace.clientList();
	for (var i = 0; i < clients.length; i++) {
		connectClient(clients[i]);
  }
  
  function connectClient(client) {
    client.clientFinishUserMovedResized.connect(handleResize)
        client['clientMaximizedStateChanged(KWin::AbstractClient*,bool,bool)'].connect(handleResize)

       // client.clientMaximizedStateChanged.connect(handleResize)

  }

  function handleResize(client, h, w) {
      print(inspect(client.geometry))
   
      var g = client.geometry
      var newG = { x: g.x, y: g.y, width: g.width, height: g.height }
      
            var rightX = g.x + g.width
      var bottomY = g.y + g.height
      var fullHeight = (client.geometry.y + client.geometry.height >= workspace.workspaceHeight) && client.geometry.y <= panelMargin.top
      var fullWidth = (client.geometry.x + client.geometry.width) >= workspace.workspaceWidth && client.geometry.x == 0
      var alignedX = (g.x == (workspace.workspaceWidth / 2) || g.x == 0) && g.width == (workspace.workspaceWidth / 2)
      
      if (g.x < margin.left) {
          if (alignedX) {
                        newG.x += margin.left
                        newG.width = g.width - margin.center - margin.left  
          } else {
                newG.x = margin.left   
            }
      }
      if ((g.y - panelMargin.top ) < margin.top) {
          newG.y = panelMargin.top + margin.top   
      }

                  print(g.x, workspace.workspaceWidth / 2, g.width == (workspace.workspaceWidth / 2), (g.x == (workspace.workspaceWidth / 2) || g.x == 0), alignedX)
      if (rightX > workspace.workspaceWidth - margin.right) {
          print('here')
          if (fullWidth) {
              newG.x = margin.right
              newG.width = g.width - margin.right - margin.left
          } else {
              var delta = rightX - (workspace.workspaceWidth - margin.right)
              if (alignedX) {
                        newG.x += margin.center
                        newG.width = g.width - margin.center - delta 
            
              } else {
                newG.x -= delta
              }
          }
      }
      if (bottomY > workspace.workspaceHeight - margin.bottom) {
          if (fullHeight) {
              newG.y = panelMargin.top + margin.top
              newG.height = workspace.workspaceHeight - margin.top - margin.bottom - panelMargin.top
          } else {
                var delta = bottomY - (workspace.workspaceHeight - margin.bottom)
                newG.y -= delta
          }
      }
      client.geometry = newG
  }
  
  function inspect(o, level, ignored) {
      level = level || 0
      ignored = ignored || []
      if (level > 2) {
          return ''
      }
     var r = ''
     for (key in o) {
         if (o[key] instanceof Object && ignored.indexOf(key) == -1) {
            r += key + '={' + inspect(o[key], (+level) + 1) + '}'   
         } else {
            r += key + '=' + o[key] + ','   
         }
     }
     return r
  }
})();

