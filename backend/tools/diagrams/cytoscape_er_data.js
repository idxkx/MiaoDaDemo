const elementsData = [
  {
    "group": "nodes",
    "data": {
      "id": "Clothes",
      "name": "Clothes",
      "color": "#91CC75",
      "fields": [
        {
          "name": "id",
          "chineseName": null,
          "type": "Integer",
          "pk": true,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "user_id",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": true,
          "fk_ref": "users.id"
        },
        {
          "name": "name",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "description",
          "chineseName": null,
          "type": "Text",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "category",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "sub_category",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "color",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "pattern",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "material",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "season",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "occasion",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "brand",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "ai_features",
          "chineseName": null,
          "type": "MutableList.as_mutable(ARRAY(Float))",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "ai_tags",
          "chineseName": null,
          "type": "ARRAY",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "ai_category_confidence",
          "chineseName": null,
          "type": "Float",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "is_ai_categorized",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "is_active",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "is_favorite",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "wear_count",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "created_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "updated_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        }
      ]
    }
  },
  {
    "group": "nodes",
    "data": {
      "id": "ClothesImage",
      "name": "ClothesImage",
      "color": "#5470C6",
      "fields": [
        {
          "name": "id",
          "chineseName": null,
          "type": "Integer",
          "pk": true,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "clothes_id",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": true,
          "fk_ref": "clothes.id"
        },
        {
          "name": "image_url",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "is_primary",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "created_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "updated_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        }
      ]
    }
  },
  {
    "group": "nodes",
    "data": {
      "id": "Outfit",
      "name": "Outfit",
      "color": "#3BA272",
      "fields": [
        {
          "name": "id",
          "chineseName": null,
          "type": "Integer",
          "pk": true,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "user_id",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": true,
          "fk_ref": "users.id"
        },
        {
          "name": "name",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "description",
          "chineseName": null,
          "type": "Text",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "occasion",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "style",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "season",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "weather",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "ai_suggestions",
          "chineseName": null,
          "type": "MutableDict.as_mutable(JSON)",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "is_ai_generated",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "ai_score",
          "chineseName": null,
          "type": "Float",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "is_favorite",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "wear_count",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "last_worn_date",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "created_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "updated_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        }
      ]
    }
  },
  {
    "group": "nodes",
    "data": {
      "id": "OutfitItem",
      "name": "OutfitItem",
      "color": "#FC8452",
      "fields": [
        {
          "name": "id",
          "chineseName": null,
          "type": "Integer",
          "pk": true,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "outfit_id",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": true,
          "fk_ref": "outfits.id"
        },
        {
          "name": "clothes_id",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": true,
          "fk_ref": "clothes.id"
        },
        {
          "name": "position",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "layer",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "notes",
          "chineseName": null,
          "type": "Text",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "styling_tips",
          "chineseName": null,
          "type": "Text",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "created_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "updated_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        }
      ]
    }
  },
  {
    "group": "nodes",
    "data": {
      "id": "OutfitClothes",
      "name": "OutfitClothes",
      "color": "#9A60B4",
      "fields": [
        {
          "name": "id",
          "chineseName": null,
          "type": "Integer",
          "pk": true,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "outfit_id",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": true,
          "fk_ref": "outfits.id"
        },
        {
          "name": "clothes_id",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": true,
          "fk_ref": "clothes.id"
        },
        {
          "name": "position",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "order",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "created_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "updated_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        }
      ]
    }
  },
  {
    "group": "nodes",
    "data": {
      "id": "Tag",
      "name": "Tag",
      "color": "#EE6666",
      "fields": [
        {
          "name": "id",
          "chineseName": null,
          "type": "Integer",
          "pk": true,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "name",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "category",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "is_system",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "description",
          "chineseName": null,
          "type": "Text",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "display_order",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "created_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "updated_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        }
      ]
    }
  },
  {
    "group": "nodes",
    "data": {
      "id": "ClothesTag",
      "name": "ClothesTag",
      "color": "#73C0DE",
      "fields": [
        {
          "name": "id",
          "chineseName": null,
          "type": "Integer",
          "pk": true,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "clothes_id",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": true,
          "fk_ref": "clothes.id"
        },
        {
          "name": "tag_id",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": true,
          "fk_ref": "tags.id"
        },
        {
          "name": "is_ai_generated",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "confidence",
          "chineseName": null,
          "type": "Float",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "created_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "updated_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        }
      ]
    }
  },
  {
    "group": "nodes",
    "data": {
      "id": "User",
      "name": "User",
      "color": "#FAC858",
      "fields": [
        {
          "name": "id",
          "chineseName": null,
          "type": "Integer",
          "pk": true,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "openid",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "nickname",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "avatar_url",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "gender",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "phone",
          "chineseName": null,
          "type": "String",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "is_active",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "is_admin",
          "chineseName": null,
          "type": "Boolean",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "style_preference",
          "chineseName": null,
          "type": "MutableDict.as_mutable(JSON)",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "color_preference",
          "chineseName": null,
          "type": "MutableDict.as_mutable(JSON)",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "season_preference",
          "chineseName": null,
          "type": "MutableDict.as_mutable(JSON)",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "last_login_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "login_count",
          "chineseName": null,
          "type": "Integer",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "created_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        },
        {
          "name": "updated_at",
          "chineseName": null,
          "type": "DateTime",
          "pk": false,
          "fk": false,
          "fk_ref": null
        }
      ]
    }
  },
  {
    "group": "edges",
    "data": {
      "id": "fk_Clothes_user_id_User",
      "source": "Clothes",
      "target": "User",
      "label": "N:1",
      "color": "#5470C6",
      "description": "FK: Clothes.user_id -> User.id"
    }
  },
  {
    "group": "edges",
    "data": {
      "id": "fk_ClothesImage_clothes_id_Clothes",
      "source": "ClothesImage",
      "target": "Clothes",
      "label": "N:1",
      "color": "#5470C6",
      "description": "FK: ClothesImage.clothes_id -> Clothes.id"
    }
  },
  {
    "group": "edges",
    "data": {
      "id": "fk_Outfit_user_id_User",
      "source": "Outfit",
      "target": "User",
      "label": "N:1",
      "color": "#5470C6",
      "description": "FK: Outfit.user_id -> User.id"
    }
  },
  {
    "group": "edges",
    "data": {
      "id": "fk_OutfitItem_outfit_id_Outfit",
      "source": "OutfitItem",
      "target": "Outfit",
      "label": "N:1",
      "color": "#5470C6",
      "description": "FK: OutfitItem.outfit_id -> Outfit.id"
    }
  },
  {
    "group": "edges",
    "data": {
      "id": "fk_OutfitItem_clothes_id_Clothes",
      "source": "OutfitItem",
      "target": "Clothes",
      "label": "N:1",
      "color": "#5470C6",
      "description": "FK: OutfitItem.clothes_id -> Clothes.id"
    }
  },
  {
    "group": "edges",
    "data": {
      "id": "fk_OutfitClothes_outfit_id_Outfit",
      "source": "OutfitClothes",
      "target": "Outfit",
      "label": "N:1",
      "color": "#5470C6",
      "description": "FK: OutfitClothes.outfit_id -> Outfit.id"
    }
  },
  {
    "group": "edges",
    "data": {
      "id": "fk_OutfitClothes_clothes_id_Clothes",
      "source": "OutfitClothes",
      "target": "Clothes",
      "label": "N:1",
      "color": "#5470C6",
      "description": "FK: OutfitClothes.clothes_id -> Clothes.id"
    }
  },
  {
    "group": "edges",
    "data": {
      "id": "fk_ClothesTag_clothes_id_Clothes",
      "source": "ClothesTag",
      "target": "Clothes",
      "label": "N:1",
      "color": "#5470C6",
      "description": "FK: ClothesTag.clothes_id -> Clothes.id"
    }
  },
  {
    "group": "edges",
    "data": {
      "id": "fk_ClothesTag_tag_id_Tag",
      "source": "ClothesTag",
      "target": "Tag",
      "label": "N:1",
      "color": "#5470C6",
      "description": "FK: ClothesTag.tag_id -> Tag.id"
    }
  }
];